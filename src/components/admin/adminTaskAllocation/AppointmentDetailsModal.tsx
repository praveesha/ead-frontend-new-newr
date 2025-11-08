import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Stack,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Card,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import type { Appointment } from '../../../types/appointment';

interface AppointmentDetailsModalProps {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onAllocate: () => void;
  isAllocating?: boolean;
}

const serviceMap: Record<string, string> = {
  oil_change: 'Oil Change',
  tire_rotation: 'Tire Rotation',
  brake_service: 'Brake Service',
  engine_tune_up: 'Engine Tune-Up',
  car_wash: 'Car Wash',
  full_service: 'Full Service',
};

const formatServiceName = (s: string) =>
  serviceMap[s] || s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const formatTime = (time: string) => {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
};

export const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  open,
  appointment,
  onClose,
  onAllocate,
  isAllocating = false,
}) => {
  if (!open) return null;

  const isReady = !!appointment;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      
    >
      <DialogTitle
        sx={{
          pr: 5,
          fontWeight: 700,
          borderBottom: '1px solid var(--color-border-primary)',
        }}
      >
        Appointment Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            '&:hover': { opacity: 0.85 },
          }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, minHeight: 160 }}>
        {!isReady ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Stack spacing={3}>
            {/* Status + ID */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Chip
                label={appointment.status}
                sx={{ fontWeight: 600 }}
              />
              <Typography variant="caption" sx={{fontWeight: 500 }}>
                ID: #{appointment.id}
              </Typography>
            </Stack>

            {/* Customer Info */}
            <Card
              sx={{
                p: 2.5,
                borderRadius: 2,
                borderBottom: '1px solid var(--color-border-strong)',     
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <PersonOutlineIcon sx={{ fontSize: 20}} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Customer Information
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <InfoRow label="Name"  value={appointment.customer?.fullName || appointment.customerName || 'N/A'} />
                <InfoRow label="Email" value={appointment.customer?.email || appointment.customerEmail || 'N/A'} />
                {appointment.customerPhone && (
                  <InfoRow label="Phone" value={appointment.customerPhone} />
                )}
              </Stack>
            </Card>

            {/* Service Details */}
            <Card
              sx={{
                p: 2.5,
                border: '1px solid var(--color-border-primary)',
                borderRadius: 2,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <PlaylistAddIcon sx={{ fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Service Details
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600 }}
                  >
                    Service Type
                  </Typography>
                  <Chip
                    label={formatServiceName(appointment.service || (appointment as any).serviceType || '')}
                    sx={{
                      mt: 0.5,
                      fontWeight: 600,
                    }}
                    size="small"
                  />
                </Box>

                <Stack direction="row" spacing={4}>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600 }}
                    >
                      Date
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                      <EventIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatDate(appointment.date)}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600 }}
                    >
                      Time
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatTime(appointment.time)}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            </Card>

            {/* Vehicle Info */}
            <Card
              sx={{
                p: 2.5,
                border: '1px solid var(--color-border-primary)',
                borderRadius: 2,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <DirectionsCarIcon sx={{ fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Vehicle Information
                </Typography>
              </Stack>
              <Stack direction="row" spacing={4}>
                <InfoRow label="Type" value={appointment.vehicleType} />
                <InfoRow label="Number" value={appointment.vehicleNumber} />
              </Stack>
            </Card>

            {/* Instructions */}
            {appointment.instructions && (
              <Card
                sx={{
                  p: 2.5,
                  border: '1px solid var(--color-border-primary)',
                  borderRadius: 2,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <InfoOutlinedIcon sx={{ fontSize: 20 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Special Instructions
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ lineHeight: 1.5 }}
                >
                  {appointment.instructions}
                </Typography>
              </Card>
            )}
          </Stack>
        )}
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid var(--color-border-primary)',
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{
            borderColor: 'var(--color-border-primary)', 
            textTransform: 'none',
          }}
        >
          Close
        </Button>
        <Button
          onClick={onAllocate}
          variant="contained"
          disabled={isAllocating || !isReady}
          startIcon={
            isAllocating ? <CircularProgress size={18} sx={{ color: 'white' }} /> : undefined
          }
          sx={{
            bgcolor: 'var(--color-primary)',
            '&:hover': { bgcolor: 'var(--color-primary-dark)' },
            textTransform: 'none',
            minWidth: 180,
          }}
        >
          {isAllocating ? 'Allocating...' : 'Allocate Employee'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box>
    <Typography variant="caption" sx={{fontWeight: 600 }}>
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{ fontWeight: 500, mt: 0.25 }}
    >
      {value || 'N/A'}
    </Typography>
  </Box>
);

export default AppointmentDetailsModal;