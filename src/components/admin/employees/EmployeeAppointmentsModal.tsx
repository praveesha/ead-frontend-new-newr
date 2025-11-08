import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Divider,
  Avatar,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  DirectionsCar as CarIcon,
  Build as BuildIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import axiosInstance from '../../../utils/axiosInstance';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

interface Employee {
  id: number;
  name: string;
  email: string;
}

interface Appointment {
  id: number;
  date: string;
  time: string;
  vehicleType: string;
  vehicleNumber: string;
  service: string;
  instructions: string | null;
  status: string;
  customer: Customer;
  employee: Employee | null;
  createdAt: string;
  updatedAt: string;
}

interface EmployeeAppointmentsModalProps {
  open: boolean;
  onClose: () => void;
  employeeId: number;
  employeeName: string;
}

const EmployeeAppointmentsModal: React.FC<EmployeeAppointmentsModalProps> = ({
  open,
  onClose,
  employeeId,
  employeeName,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchAppointments();
    }
  }, [open, employeeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/appointments/employee/${employeeId}`);
      setAppointments(response.data);
    } catch (err) {
      console.error('Error fetching employee appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVE':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'IN_PROGRESS':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'REJECT':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Group appointments by status
  const groupedAppointments = {
    active: appointments.filter(
      (a) => a.status === 'IN_PROGRESS' || a.status === 'APPROVE' || a.status === 'PENDING'
    ),
    completed: appointments.filter((a) => a.status === 'COMPLETED'),
    rejected: appointments.filter((a) => a.status === 'REJECT'),
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {employeeName}'s Appointments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {appointments.length} total appointment{appointments.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : appointments.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No appointments found
            </Typography>
            <Typography variant="body2" color="text.disabled">
              This employee has no assigned appointments yet
            </Typography>
          </Box>
        ) : (
          <Box>
            {/* Active Appointments */}
            {groupedAppointments.active.length > 0 && (
              <Box mb={3}>
                <Typography variant="subtitle1" fontWeight={700} color="primary.main" mb={2}>
                  Active Appointments ({groupedAppointments.active.length})
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {groupedAppointments.active.map((appointment) => (
                    <Card
                      key={appointment.id}
                      elevation={0}
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: 2,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            Appointment #{appointment.id}
                          </Typography>
                          <Chip
                            label={appointment.status.replace('_', ' ')}
                            size="small"
                            color={getStatusColor(appointment.status)}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>

                        <Box display="flex" gap={2} mb={2}>
                          <Box display="flex" alignItems="center" gap={0.75}>
                            <CalendarIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                            <Typography variant="body2">{formatDate(appointment.date)}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.75}>
                            <TimeIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                            <Typography variant="body2">{formatTime(appointment.time)}</Typography>
                          </Box>
                        </Box>

                        <Box display="flex" flexDirection="column" gap={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <PersonIcon sx={{ fontSize: 16, color: 'action.active' }} />
                            <Typography variant="body2" color="text.secondary">
                              Customer:
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {appointment.customer.name}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" gap={1}>
                            <CarIcon sx={{ fontSize: 16, color: 'action.active' }} />
                            <Typography variant="body2" fontWeight={600}>
                              {appointment.vehicleType} - {appointment.vehicleNumber}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" gap={1}>
                            <BuildIcon sx={{ fontSize: 16, color: 'action.active' }} />
                            <Typography variant="body2">{appointment.service}</Typography>
                          </Box>

                          {appointment.instructions && (
                            <Box display="flex" alignItems="start" gap={1} mt={1}>
                              <DescriptionIcon sx={{ fontSize: 16, color: 'action.active', mt: 0.2 }} />
                              <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                                {appointment.instructions}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}

            {/* Completed Appointments */}
            {groupedAppointments.completed.length > 0 && (
              <Box mb={3}>
                <Typography variant="subtitle1" fontWeight={700} color="success.main" mb={2}>
                  Completed Appointments ({groupedAppointments.completed.length})
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {groupedAppointments.completed.map((appointment) => (
                    <Card
                      key={appointment.id}
                      elevation={0}
                      sx={{
                        border: 1,
                        borderColor: 'success.100',
                        borderRadius: 2,
                        bgcolor: 'success.50',
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2" fontWeight={600} gutterBottom>
                              #{appointment.id} - {appointment.customer.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {appointment.service} • {formatDate(appointment.date)}
                            </Typography>
                          </Box>
                          <Chip label="COMPLETED" size="small" color="success" sx={{ fontWeight: 600 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}

            {/* Rejected Appointments */}
            {groupedAppointments.rejected.length > 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight={700} color="error.main" mb={2}>
                  Rejected Appointments ({groupedAppointments.rejected.length})
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {groupedAppointments.rejected.map((appointment) => (
                    <Card
                      key={appointment.id}
                      elevation={0}
                      sx={{
                        border: 1,
                        borderColor: 'error.100',
                        borderRadius: 2,
                        bgcolor: 'error.50',
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2" fontWeight={600} gutterBottom>
                              #{appointment.id} - {appointment.customer.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {appointment.service} • {formatDate(appointment.date)}
                            </Typography>
                          </Box>
                          <Chip label="REJECTED" size="small" color="error" sx={{ fontWeight: 600 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeAppointmentsModal;
