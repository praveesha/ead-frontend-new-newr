import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Chip,
  IconButton,
  Divider,
  Grid,
} from '@mui/material';
import {
  Close,
  CalendarToday,
  AccessTime,
  Person,
  Email,
  Phone,
  DirectionsCar,
  Build,
} from '@mui/icons-material';
import { getStatusColor, getStatusIcon } from '../../helpers/colorhelper';
import type { Appointment } from './EmployeeDataGrid';

interface DetailsDialogProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export default function DetailsDialog({ open, onClose, appointment }: DetailsDialogProps) {
  if (!appointment) return null;

  const StatusIcon = getStatusIcon(appointment.status);

  const getProgressColor = (progress: number) => {
    if (progress < 25) return '#dc2626';
    if (progress < 50) return '#f59e0b';
    if (progress < 75) return '#3b82f6';
    return '#10b981';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Appointment Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ borderColor: 'rgba(212, 212, 216, 0.2)' }} />

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          {/* Appointment ID */}
          <Grid sx={{xs: 12, sm: 6}}>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', mb: 0.5 }}
              >
                Appointment Id
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                #{appointment.id}
              </Typography>
            </Box>
          </Grid>

          {/* Date & Time */}
          <Grid sx={{xs: 12, sm: 6}}>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', mb: 0.5 }}
              >
                Date and Time
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarToday sx={{ fontSize: 18, color: 'var(--color-primary)' }} />
                <Typography variant="body2">
                  {appointment.date}
                </Typography>
                <AccessTime sx={{ fontSize: 18, color: 'var(--color-primary)', ml: 2 }} />
                <Typography variant="body2">
                  {appointment.time}
                </Typography>
              </Stack>
            </Box>
          </Grid>

          <Grid sx={{xs: 12}}>
            <Divider sx={{ borderColor: 'rgba(212, 212, 216, 0.2)' }} />
          </Grid>

          {/* Customer Name */}
          <Grid sx={{xs: 12, sm: 6}}>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', mb: 0.5 }}
              >
                Customer Name
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Person sx={{ fontSize: 18, color: 'var(--color-text-tertiary)' }} />
                <Typography variant="body1">
                  {appointment.customerName}
                </Typography>
              </Stack>
            </Box>
          </Grid>

          {/* Customer Email */}
          <Grid sx={{xs: 12, sm: 6}}>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', mb: 0.5 }}
              >
                Email
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Email sx={{ fontSize: 18, color: 'var(--color-text-tertiary)' }} />
                <Typography variant="body1">
                  {appointment.customerEmail}
                </Typography>
              </Stack>
            </Box>
          </Grid>

          {/* Customer Phone */}
          <Grid sx={{xs: 12, sm: 6}}>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', mb: 0.5 }}
              >
                Phone Number
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Phone sx={{ fontSize: 18, color: 'var(--color-text-tertiary)' }} />
                <Typography variant="body1">
                  {appointment.customerPhone}
                </Typography>
              </Stack>
            </Box>
          </Grid>

          <Grid sx={{xs: 12}}>
            <Divider sx={{ borderColor: 'rgba(212, 212, 216, 0.2)' }} />
          </Grid>

          {/* Vehicle Type */}
          <Grid sx={{xs: 12, sm: 6}}>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', mb: 0.5 }}
              >
                Vehicle Type
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <DirectionsCar sx={{ fontSize: 18, color: 'var(--color-text-tertiary)' }} />
                <Typography variant="body1">
                  {appointment.vehicleType}
                </Typography>
              </Stack>
            </Box>
          </Grid>

          {/* Vehicle Number */}
          <Grid sx={{xs: 12, sm: 6}}>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', mb: 0.5 }}
              >
                Vehicle Number
              </Typography>
              <Typography variant="body1">
                {appointment.vehicleNumber}
              </Typography>
            </Box>
          </Grid>

          {/* Service */}
          <Grid sx={{xs: 12}}>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', mb: 0.5 }}
              >
                Service Type
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Build sx={{ fontSize: 18, color: 'var(--color-text-tertiary)' }} />
                <Typography variant="body1">
                  {appointment.service}
                </Typography>
              </Stack>
            </Box>
          </Grid>

          <Grid sx={{xs: 12}}>
            <Divider sx={{ borderColor: 'rgba(212, 212, 216, 0.2)' }} />
          </Grid>

          {/* Status */}
          <Grid sx={{xs: 12, sm: 6}}>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', mb: 1 }}
              >
                Status
              </Typography>
              <Chip
                icon={<StatusIcon sx={{ fontSize: 16 }} />}
                label={appointment.status.toUpperCase()}
                color={getStatusColor(appointment.status)}
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Grid>

          {/* Progress */}
          <Grid sx={{xs: 12, sm: 6}}>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', mb: 1 }}
              >
                Progress
              </Typography>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      color: getProgressColor(appointment.progress),
                    }}
                  >
                    {appointment.progress}%
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    width: '100%',
                    height: 8,
                    bgcolor: 'rgba(212, 212, 216, 0.2)',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${appointment.progress}%`,
                      height: '100%',
                      bgcolor: getProgressColor(appointment.progress),
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Instructions */}
          <Grid sx={{xs: 12}}>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', mb: 0.5 }}
              >
                Special Instructions
              </Typography>
              <Typography variant="body1">
                {appointment.instructions}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider sx={{ borderColor: 'rgba(212, 212, 216, 0.2)' }} />

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: 'var(--color-primary)',
            '&:hover': {
              bgcolor: 'var(--color-primary-dark)',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}