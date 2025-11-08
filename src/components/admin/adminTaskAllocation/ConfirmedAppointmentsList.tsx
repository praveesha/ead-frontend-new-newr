import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import { 
  AssignmentLate as NoAppointmentsIcon 
} from '@mui/icons-material';
import type { GroupedAppointments } from '../../../types/appointment';
import AppointmentCard from './AppointmentCard';

interface ConfirmedAppointmentsListProps {
  groupedAppointments: GroupedAppointments[];
  onAppointmentClick: (appointmentId: number) => void;
}

const ConfirmedAppointmentsList: React.FC<ConfirmedAppointmentsListProps> = ({
  groupedAppointments,
  onAppointmentClick,
}) => {
  const theme = useTheme();

  if (groupedAppointments.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 3,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          }}
        >
          <NoAppointmentsIcon 
            sx={{ 
              fontSize: 40, 
              color: 'text.secondary' 
            }} 
          />
        </Box>
        <Typography variant="h6" fontWeight={600} gutterBottom color="text.primary">
          No Approved Appointments
        </Typography>
        <Typography variant="body2" color="text.secondary">
          There are no approved appointments to allocate at this time.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {groupedAppointments.map((group) => {
        // Extract customer name and email with fallbacks
        const customerName = group.customerName || 'Unknown Customer';
        const customerEmail = group.customerEmail || 'No email provided';
        const firstLetter = customerName.charAt(0).toUpperCase();

        return (
          <Paper
            key={`${customerEmail}-${group.customerId || 'anonymous'}`}
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: theme.shadows[6],
              },
            }}
          >
            {/* Customer Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
                pb: 2,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Avatar */}
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'primary.main',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                  }}
                >
                  {firstLetter}
                </Avatar>

                {/* Customer Info */}
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {customerName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {customerEmail}
                  </Typography>
                </Box>
              </Box>

              {/* Appointment Count Badge */}
              {group.totalCount > 1 && (
                <Chip
                  label={`${group.totalCount} Services`}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Box>

            {/* Appointments Grid */}
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)'
                },
                gap: 2
              }}
            >
              {group.appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onClick={() => onAppointmentClick(appointment.id)}
                />
              ))}
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default ConfirmedAppointmentsList;