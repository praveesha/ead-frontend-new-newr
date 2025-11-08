import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Link as LinkIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import axiosInstance from '../../../utils/axiosInstance';

interface RescheduleOption {
  id: string;
  date: string;
  time: string;
}

interface RescheduleModalProps {
  open: boolean;
  onClose: () => void;
  appointment: {
    id: number;
    customer: {
      email: string;
      fullName: string;
    };
    vehicleType: string;
    vehicleNumber: string;
    service: string;
  };
  onSuccess: () => void;
}

export default function RescheduleModal({ open, onClose, appointment, onSuccess }: RescheduleModalProps) {
  const [rescheduleOptions, setRescheduleOptions] = useState<RescheduleOption[]>([]);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleAddOption = () => {
    if (!currentDate || !currentTime) {
      setError('Please enter both date and time');
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(`${currentDate}T${currentTime}`);
    const now = new Date();
    if (selectedDate < now) {
      setError('Cannot schedule in the past');
      return;
    }

    const newOption: RescheduleOption = {
      id: `${Date.now()}-${Math.random()}`,
      date: currentDate,
      time: currentTime,
    };

    setRescheduleOptions([...rescheduleOptions, newOption]);
    setCurrentDate('');
    setCurrentTime('');
    setError('');
  };

  const handleRemoveOption = (id: string) => {
    setRescheduleOptions(rescheduleOptions.filter(option => option.id !== id));
  };

  const generateBookingLink = (option: RescheduleOption) => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      date: option.date,
      time: option.time,
      vehicleType: appointment.vehicleType,
      vehicleNumber: appointment.vehicleNumber,
      service: appointment.service,
      reschedule: 'true',
    });
    return `${baseUrl}/dashboard?${params.toString()}`;
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const generateEmailMessage = () => {
    const customerName = appointment.customer.fullName;
    const vehicleInfo = `${appointment.vehicleType} (${appointment.vehicleNumber})`;
    const service = appointment.service;

    let message = `Dear ${customerName},\n\n`;
    message += `We regret to inform you that we need to reschedule your appointment for ${service} service on your ${vehicleInfo}.\n\n`;
    message += `We apologize for any inconvenience this may cause. Please choose one of the following alternative time slots to book your new appointment:\n\n`;

    rescheduleOptions.forEach((option, index) => {
      const link = generateBookingLink(option);
      message += `Option ${index + 1}: ${formatDateTime(option.date, option.time)}\n`;
      message += `   Click here to book: ${link}\n\n`;
    });

    message += `Each link will automatically fill in your vehicle and service details. Simply click your preferred time slot and confirm your booking.\n\n`;
    message += `If none of these times work for you, please contact us directly to find a suitable alternative.\n\n`;
    message += `We appreciate your understanding and look forward to serving you.\n\n`;
    message += `Best regards,\nAutoCare Team`;

    return message;
  };

  const handleSendEmail = async () => {
    if (rescheduleOptions.length === 0) {
      setError('Please add at least one reschedule option');
      return;
    }

    try {
      setSending(true);
      setError('');

      const emailMessage = generateEmailMessage();

      // Send email
      await axiosInstance.post('/email/send', {
        email: appointment.customer.email,
        message: emailMessage,
      });

      // Update appointment status to REJECTED
      await axiosInstance.patch(`/appointments/${appointment.id}/status`, {
        status: 'REJECT',
        notes: 'Appointment rescheduled - email sent with alternative time slots',
      });

      onSuccess();
      handleClose();
    } catch (err) {
      console.error('Error sending reschedule email:', err);
      const errorMessage = err instanceof Error && 'response' in err && err.response ? 
        (err.response as { data?: { message?: string } }).data?.message || 'Failed to send email. Please try again.' :
        'Failed to send email. Please try again.';
      setError(errorMessage);
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setRescheduleOptions([]);
    setCurrentDate('');
    setCurrentTime('');
    setError('');
    onClose();
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <CalendarIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Reschedule Appointment
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Customer: {appointment.customer.fullName} ({appointment.customer.email})
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Add New Reschedule Option */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Add Reschedule Time Slots
          </Typography>
          <Box display="flex" gap={2} alignItems="center" sx={{ mt: 2 }}>
            <TextField
              label="Date"
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: getTodayDate() }}
              fullWidth
              size="small"
            />
            <TextField
              label="Time"
              type="time"
              value={currentTime}
              onChange={(e) => setCurrentTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
            />
            <IconButton
              color="primary"
              onClick={handleAddOption}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* List of Reschedule Options */}
        <Box>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Reschedule Options ({rescheduleOptions.length})
          </Typography>

          {rescheduleOptions.length === 0 ? (
            <Box
              sx={{
                p: 3,
                textAlign: 'center',
                bgcolor: 'background.default',
                borderRadius: 1,
                border: '1px dashed',
                borderColor: 'divider',
              }}
            >
              <TimeIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No reschedule options added yet
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Add at least one time slot to send reschedule email
              </Typography>
            </Box>
          ) : (
            <List>
              {rescheduleOptions.map((option, index) => (
                <ListItem
                  key={option.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: 'background.default',
                  }}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip label={`Option ${index + 1}`} size="small" color="primary" />
                        <Typography variant="body2" fontWeight={600}>
                          {formatDateTime(option.date, option.time)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 1 }}>
                        <LinkIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {generateBookingLink(option)}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveOption(option.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Email Preview */}
        {rescheduleOptions.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Email Preview
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                maxHeight: 200,
                overflow: 'auto',
              }}
            >
              <Typography
                variant="body2"
                component="pre"
                sx={{
                  fontFamily: 'inherit',
                  color: 'black',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  m: 0,
                }}
              >
                {generateEmailMessage()}
              </Typography>
            </Paper>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={handleClose} disabled={sending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={sending ? <CircularProgress size={20} /> : <SendIcon />}
          onClick={handleSendEmail}
          disabled={sending || rescheduleOptions.length === 0}
        >
          {sending ? 'Sending...' : 'Send Reschedule Email & Reject'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
