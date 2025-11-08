import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import type { Appointment } from '../../../types/appointment';

interface AppointmentCardProps {
  appointment: Appointment;
  onClick: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  onClick 
}) => {
  const theme = useTheme();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    // time is in HH:mm:ss format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Card
      onClick={onClick}
      elevation={2}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          borderColor: 'primary.main',
        },
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        height: '100%',
      }}
    >
      <CardContent>
        {/* Service Type Badge and Arrow */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Chip
            label={appointment.serviceType}
            size="small"
            color="primary"
            sx={{ 
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
          <ChevronRightIcon 
            sx={{ 
              color: 'text.secondary',
              fontSize: 20
            }} 
          />
        </Box>

        {/* Vehicle Info */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <CarIcon sx={{ fontSize: 20, color: 'primary.main' }} />
            <Typography variant="body2" fontWeight={600}>
              {appointment.vehicleType}
            </Typography>
          </Box>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ ml: 3.5, display: 'block' }}
          >
            {appointment.vehicleNumber}
          </Typography>
        </Box>

        {/* Date & Time */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flexWrap: 'wrap',
            pt: 1,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(appointment.date)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {formatTime(appointment.time)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;