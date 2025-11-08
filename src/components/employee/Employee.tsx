import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
  Stack,
  IconButton,
} from '@mui/material';
import { Refresh, Assignment as AssignmentIcon, CheckCircle } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import EmployeeDataGrid from './EmployeeDataGrid';
import type { Appointment } from './EmployeeDataGrid';
import StatCard from '../admin/dashboard/StatCard';

export default function Employee() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const stats = useMemo(() => {
    const totalAssigned = appointments.length;
    const completedAppointments = appointments.filter(
      (apt) => apt.status === 'completed' || apt.progress === 100
    ).length;

    return {
      totalAssigned,
      completedAppointments,
    };
  }, [appointments]);

  // Format time from API
  const formatTime = (time: any): string => {
    let hour: number, minute: number;

    if (typeof time === 'string') {
      const [hourStr, minuteStr] = time.split(':');
      hour = parseInt(hourStr, 10);
      minute = parseInt(minuteStr, 10);
    } else if (time && typeof time === 'object') {
      hour = time.hour;
      minute = time.minute;
    } else {
      hour = 0;
      minute = 0;
    }

    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${ampm}`;
  };

  // Transform API appointment
  const transformApiAppointment = useCallback((apiAppointment: any): Appointment => {
    return {
      id: apiAppointment.id,
      date: apiAppointment.date,
      time: formatTime(apiAppointment.time),
      service: apiAppointment.service || apiAppointment.serviceType,
      vehicleType: apiAppointment.vehicleType,
      vehicleNumber: apiAppointment.vehicleNumber,
      instructions: apiAppointment.instructions || 'No special instructions',
      status: apiAppointment.status?.toLowerCase() || 'pending',
      progress: typeof apiAppointment.progress === 'number' ? apiAppointment.progress : 0,
      customerName: apiAppointment.customerName || 'Unknown',
      customerEmail: apiAppointment.customerEmail || 'Unknown',
      customerPhone: apiAppointment.customerPhone || 'Unknown',
    };
  }, []);

  const fetchAppointments = useCallback(async () => {
    if (!user?.id) {
      setError('User ID not available');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching appointments for employee ID:', user.id);

      const response = await axiosInstance.get(
        API_PATHS.APPOINTMENTS.GET_EMPLOYEE_APPOINTMENTS(user.id)
      );


      if (!response.data || response.data.length === 0) {
        setAppointments([]);
        return;
      }

      const transformedAppointments = response.data.map(transformApiAppointment);
      console.log('Transformed appointments:', transformedAppointments);
      
      setAppointments(transformedAppointments);
    } catch (err: any) {
      console.error('Error fetching appointments:', err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to fetch appointments';
      setError(message);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, transformApiAppointment]);

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
  }, [user?.id, fetchAppointments]);

  // Update progress handler
  const handleUpdateProgress = async (appointmentId: number, progress: number) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Updating appointment ${appointmentId} progress to ${progress}%`);

      // Ensure progress is sent as an integer (0-100)
      const progressValue = Math.round(Math.max(0, Math.min(100, progress)));

      await axiosInstance.patch(
        API_PATHS.APPOINTMENTS.UPDATE_PROGRESS(appointmentId),
        { progress: progressValue } // Matches UpdateProgressRequest structure
      );

      await fetchAppointments();
      console.log(`Successfully updated appointment ${appointmentId} progress to ${progressValue}%`);
    } catch (err: any) {
      console.error('Error updating progress:', err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update progress';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Statistics Cards */}

        <Typography
                variant="h4"
                sx={{mb:2}}
              >
                Welcome back, {user?.fullName || 'Employee'}
              </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 3,
            mb: 4,
          }}
        >
          <StatCard
            title="ASSIGNED APPOINTMENTS"
            value={stats.totalAssigned}
            icon={<AssignmentIcon sx={{ fontSize: 32, color: "#007BFF" }} />}
            color="#007BFF"
          />
          <StatCard
            title="COMPLETED APPOINTMENTS"
            value={stats.completedAppointments}
            icon={<CheckCircle sx={{ fontSize: 32, color: "#28a745" }} />}
            color="#28a745"
          />
        </Box>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                }}
              >
                My Assigned Appointments
              </Typography>
              
            </Box>

            <IconButton
              onClick={fetchAppointments}
              disabled={loading}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(214, 5, 7, 0.1)',
                },
              }}
            >
              <Refresh sx={{ color: 'var(--color-primary)' }} />
            </IconButton>
          </Stack>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {!loading && appointments.length === 0 && !error && (
          <Alert severity="info" sx={{ mb: 4 }}>
            No appointments assigned yet. Check back later for new assignments.
          </Alert>
        )}

        {/* Data Grid */}
        <EmployeeDataGrid 
          appointments={appointments} 
          loading={loading}
          onUpdateProgress={handleUpdateProgress}
        />
      </Container>
    </Box>
  );
}