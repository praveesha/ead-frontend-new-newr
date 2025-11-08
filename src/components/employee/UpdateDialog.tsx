import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Slider,
  TextField,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import {
  Close,
  Save,
  TrendingUp,
} from '@mui/icons-material';
import type { Appointment } from './EmployeeDataGrid';

interface UpdateDialogProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onUpdate: (appointmentId: number, progress: number) => Promise<void>;
}

export default function UpdateDialog({ open, onClose, appointment, onUpdate }: UpdateDialogProps) {
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize progress when appointment changes
  useEffect(() => {
    if (appointment && open) {
      const currentProgress = typeof appointment.progress === 'number' 
        ? appointment.progress 
        : 0;
      setProgress(currentProgress);
      setError(null);
      console.log('Dialog opened with progress:', currentProgress);
    }
  }, [appointment, open]);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setProgress(newValue as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === '' ? 0 : Number(event.target.value);
    setProgress(value);
  };

  const handleBlur = () => {
    if (progress < 0) {
      setProgress(0);
    } else if (progress > 100) {
      setProgress(100);
    }
  };

  const handleSubmit = async () => {
    if (!appointment) return;

    try {
      setLoading(true);
      setError(null);
      await onUpdate(appointment.id, progress);
      onClose();
    } catch (err: any) {
      console.error('Error updating progress:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = () => {
    if (progress < 25) return '#dc2626'; // red
    if (progress < 50) return '#f59e0b'; // orange
    if (progress < 75) return '#3b82f6'; // blue
    return '#10b981'; // green
  };

  const getProgressLabel = () => {
    if (progress === 0) return 'Not Started';
    if (progress < 25) return 'Just Started';
    if (progress < 50) return 'In Progress';
    if (progress < 75) return 'More than Half';
    if (progress < 100) return 'Almost Done';
    return 'Completed';
  };

  if (!appointment) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
        <Stack direction="row" spacing={1} alignItems="center">
          <TrendingUp sx={{ color: 'var(--color-primary)' }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Update Progress
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small" disabled={loading}>
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ borderColor: 'rgba(212, 212, 216, 0.2)' }} />

      <DialogContent sx={{ pt: 3 }}>
        {/* Appointment Info */}
        <Box sx={{ mb: 3, p: 2, borderRadius: 2 }}>
          <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Appointment
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
            #{appointment.id} - {appointment.service}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {appointment.customerName} | {appointment.vehicleNumber}
          </Typography>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Progress Label */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Current Progress
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: getProgressColor(),
                fontWeight: 700,
              }}
            >
              {progress}%
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            sx={{
              color: getProgressColor(),
              fontWeight: 600,
              display: 'block',
              textAlign: 'right',
              mt: 0.5,
            }}
          >
            {getProgressLabel()}
          </Typography>
        </Box>

        {/* Progress Slider */}
        <Box sx={{ px: 1, mb: 3 }}>
          <Slider
            value={progress}
            onChange={handleSliderChange}
            aria-label="Progress"
            valueLabelDisplay="auto"
            step={5}
            marks={[
              { value: 0, label: '0%' },
              { value: 25, label: '25%' },
              { value: 50, label: '50%' },
              { value: 75, label: '75%' },
              { value: 100, label: '100%' },
            ]}
            min={0}
            max={100}
            sx={{
              color: getProgressColor(),
              '& .MuiSlider-thumb': {
                width: 24,
                height: 24,
              },
              '& .MuiSlider-valueLabel': {
                backgroundColor: getProgressColor(),
              },
              '& .MuiSlider-mark': {
                backgroundColor: 'var(--color-text-muted)',
              },
              '& .MuiSlider-markLabel': {
                color: 'var(--color-text-muted)',
                fontSize: '0.75rem',
              },
            }}
          />
        </Box>

        {/* Manual Input */}
        <Box>
          <Typography
            variant="caption"
            sx={{ color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', mb: 1 }}
          >
            OR ENTER MANUALLY
          </Typography>
          <TextField
            value={progress}
            onChange={handleInputChange}
            onBlur={handleBlur}
            type="number"
            fullWidth
            size="small"
            inputProps={{
              min: 0,
              max: 100,
              step: 1,
            }}
            InputProps={{
              endAdornment: <Typography sx={{ color: 'var(--color-text-muted)' }}>%</Typography>,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
              },
            }}
          />
        </Box>

        {/* Progress Bar Visualization */}
        <Box sx={{ mt: 3 }}>
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
                width: `${progress}%`,
                height: '100%',
                bgcolor: getProgressColor(),
                transition: 'all 0.3s ease',
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <Divider sx={{ borderColor: 'rgba(212, 212, 216, 0.2)' }} />

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{
            color: 'var(--color-text-primary)',
            borderColor: 'rgba(212, 212, 216, 0.3)',
            '&:hover': {
              borderColor: 'var(--color-text-primary)',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={<Save />}
          sx={{
            bgcolor: 'var(--color-primary)',
            '&:hover': {
              bgcolor: 'var(--color-primary-dark)',
            },
          }}
        >
          {loading ? 'Updating...' : 'Update Progress'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}