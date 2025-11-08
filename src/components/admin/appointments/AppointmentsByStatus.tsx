import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  Divider,
  Avatar,
  TextField,
  InputAdornment,
  Pagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  Build as BuildIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PlayArrow as PlayArrowIcon,
  HourglassEmpty as HourglassEmptyIcon,
  EventRepeat as EventRepeatIcon,
} from '@mui/icons-material';
import axiosInstance from '../../../utils/axiosInstance';
import RescheduleModal from './RescheduleModal';

interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
}

interface Employee {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
}

interface Appointment {
  id: number;
  date: string;
  time: string;
  vehicleType: string;
  vehicleNumber: string;
  service: string;
  instructions: string;
  status: string;
  customer: Customer;
  employee: Employee | null;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  APPROVED: 'success',
  IN_PROGRESS: 'primary',
  ONGOING: 'primary',
  ACCEPTED: 'success',
  REJECTED: 'error',
};

const serviceLabels: Record<string, string> = {
  maintenance: 'Regular Maintenance',
  repair: 'Repair Service',
  inspection: 'Vehicle Inspection',
  diagnostics: 'Diagnostics',
  oil_change: 'Oil Change',
  tire_service: 'Tire Service',
};

const vehicleTypeLabels: Record<string, string> = {
  car: '🚗 Car',
  van: '🚐 Van',
  jeep: '🚙 Jeep/SUV',
  cab: '🚕 Cab',
  truck: '🚚 Truck',
};

export default function AppointmentsByStatus() {
  const { status } = useParams<{ status: string }>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Status change dialog state
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [statusChangeLoading, setStatusChangeLoading] = useState(false);

  // Reschedule modal state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    // Filter appointments based on search query
    if (searchQuery.trim() === '') {
      setFilteredAppointments(appointments);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = appointments.filter((appointment) => {
        return (
          appointment.id.toString().includes(query) ||
          appointment.customer.fullName.toLowerCase().includes(query) ||
          appointment.customer.email.toLowerCase().includes(query) ||
          appointment.vehicleNumber.toLowerCase().includes(query) ||
          appointment.vehicleType.toLowerCase().includes(query) ||
          appointment.service.toLowerCase().includes(query) ||
          (appointment.employee?.fullName?.toLowerCase().includes(query) ?? false)
        );
      });
      setFilteredAppointments(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery, appointments]);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const statusParam = status?.toUpperCase().replace('-', '_') || 'PENDING';
      const response = await axiosInstance.get(`/appointments/status/${statusParam.toLowerCase()}`);
      setAppointments(response.data);
      setFilteredAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setSnackbarMessage('Failed to load appointments');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [status]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Status change handlers
  const handleOpenStatusDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setStatusNotes('');
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setSelectedAppointment(null);
    setNewStatus('');
    setStatusNotes('');
  };

  const handleStatusChange = async () => {
    if (!selectedAppointment || !newStatus) return;

    try {
      setStatusChangeLoading(true);
      const response = await axiosInstance.patch(
        `/appointments/${selectedAppointment.id}/status`,
        {
          status: newStatus,
          notes: statusNotes || undefined,
        }
      );

      // Update the appointment in the list
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === selectedAppointment.id ? { ...apt, status: newStatus } : apt
        )
      );

      setSnackbarMessage('Appointment status updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseStatusDialog();
      
      console.log('Status updated:', response.data);
    } catch (error) {
      console.error('Error updating status:', error);
      setSnackbarMessage('Failed to update appointment status');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setStatusChangeLoading(false);
    }
  };

  // Reschedule handlers
  const handleOpenRescheduleModal = (appointment: Appointment) => {
    setRescheduleAppointment(appointment);
    setRescheduleModalOpen(true);
  };

  const handleCloseRescheduleModal = () => {
    setRescheduleModalOpen(false);
    setRescheduleAppointment(null);
  };

  const handleRescheduleSuccess = () => {
    setSnackbarMessage('Reschedule email sent successfully! Appointment status updated to REJECTED.');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    fetchAppointments(); // Refresh the list
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>
          {status?.replace('-', ' ').toUpperCase()} Appointments
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage and track all {status?.replace('-', ' ')} appointments
        </Typography>

        {/* Search Bar */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            bgcolor: 'background.default',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by appointment ID, customer name, email, vehicle number, service type..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                bgcolor: 'background.paper',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              }
            }}
            size="medium"
          />
          
          {/* Search Results Info */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? (
                <>
                  Found <strong>{filteredAppointments.length}</strong> result{filteredAppointments.length !== 1 ? 's' : ''} 
                  {filteredAppointments.length > 0 && ` (showing ${startIndex + 1}-${Math.min(endIndex, filteredAppointments.length)})`}
                </>
              ) : (
                <>
                  Total: <strong>{appointments.length}</strong> appointment{appointments.length !== 1 ? 's' : ''}
                  {appointments.length > 0 && ` (showing ${startIndex + 1}-${Math.min(endIndex, appointments.length)})`}
                </>
              )}
            </Typography>
            {searchQuery && (
              <Chip 
                label="Searching..." 
                size="small" 
                color="primary" 
                variant="outlined"
                onDelete={handleClearSearch}
              />
            )}
          </Box>
        </Paper>
      </Box>

      {/* Loading State */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : filteredAppointments.length === 0 ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            bgcolor: 'background.default',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <SearchIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchQuery ? 'No appointments found' : `No ${status?.replace('-', ' ')} appointments`}
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {searchQuery 
              ? 'Try adjusting your search terms' 
              : 'Appointments will appear here when available'}
          </Typography>
          {searchQuery && (
            <Button 
              variant="outlined" 
              onClick={handleClearSearch} 
              sx={{ mt: 2 }}
              startIcon={<ClearIcon />}
            >
              Clear Search
            </Button>
          )}
        </Paper>
      ) : (
        <>
          {/* Appointments Grid */}
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3,
              mb: 4,
            }}
          >
            {paginatedAppointments.map((appointment) => (
              <Card 
                key={appointment.id}
                elevation={0}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                    borderColor: 'primary.main',
                    '& .card-actions': {
                      opacity: 1,
                    }
                  }
                }}
              >
                {/* Card Header with Gradient */}
                <Box 
                  sx={{ 
                    background: `linear-gradient(135deg, ${
                      statusColors[appointment.status] === 'success' ? '#4caf50' :
                      statusColors[appointment.status] === 'error' ? '#f44336' :
                      statusColors[appointment.status] === 'warning' ? '#ff9800' :
                      statusColors[appointment.status] === 'info' ? '#2196f3' :
                      '#9c27b0'
                    } 0%, ${
                      statusColors[appointment.status] === 'success' ? '#66bb6a' :
                      statusColors[appointment.status] === 'error' ? '#e57373' :
                      statusColors[appointment.status] === 'warning' ? '#ffb74d' :
                      statusColors[appointment.status] === 'info' ? '#42a5f5' :
                      '#ba68c8'
                    } 100%)`,
                    p: 2.5,
                    color: 'white',
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500 }}>
                        Appointment
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        #{appointment.id}
                      </Typography>
                    </Box>
                    <Chip 
                      label={appointment.status} 
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.25)',
                        color: 'white',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                      }}
                    />
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>                  {/* Date & Time */}
                  <Box display="flex" gap={1.5} mb={2.5}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 1.5, 
                        bgcolor: 'primary.50',
                        flex: 1,
                        borderRadius: 1.5,
                        border: 1,
                        borderColor: 'primary.100',
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <CalendarIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="caption" color="primary.main" fontWeight={600}>
                          Date
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {formatDate(appointment.date)}
                      </Typography>
                    </Paper>

                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 1.5, 
                        bgcolor: 'secondary.50',
                        flex: 1,
                        borderRadius: 1.5,
                        border: 1,
                        borderColor: 'secondary.100',
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <TimeIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                        <Typography variant="caption" color="secondary.main" fontWeight={600}>
                          Time
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {formatTime(appointment.time)}
                      </Typography>
                    </Paper>
                  </Box>

                  {/* Customer Info */}
                  <Box mb={2.5}>
                    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>
                        <PersonIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                        Customer
                      </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={0.8} pl={4.5}>
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {appointment.customer.fullName}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={0.75}>
                        <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {appointment.customer.email}
                        </Typography>
                      </Box>
                      {appointment.customer.phone && (
                        <Box display="flex" alignItems="center" gap={0.75}>
                          <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {appointment.customer.phone}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Vehicle & Service Info */}
                  <Box display="flex" flexDirection="column" gap={1.5}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <CarIcon sx={{ fontSize: 18, color: 'action.active' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Vehicle
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {vehicleTypeLabels[appointment.vehicleType] || appointment.vehicleType}
                          {appointment.vehicleNumber && ` • ${appointment.vehicleNumber}`}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1.5}>
                      <BuildIcon sx={{ fontSize: 18, color: 'action.active' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Service
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {serviceLabels[appointment.service] || appointment.service}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Instructions */}
                  {appointment.instructions && (
                    <Box mt={2}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <DescriptionIcon sx={{ fontSize: 18, color: 'action.active' }} />
                        <Typography variant="caption" fontWeight={600}>
                          Instructions
                        </Typography>
                      </Box>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 1.5, 
                          borderRadius: 1.5,
                          border: 1,
                          borderColor: 'divider',
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            color:'black',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {appointment.instructions}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  {/* Employee Info (if assigned) */}
                  {appointment.employee && (
                    <Box mt={2} pt={2} borderTop={1} borderColor="divider">
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Avatar sx={{ width: 20, height: 20, bgcolor: 'success.main' }}>
                          <PersonIcon sx={{ fontSize: 12 }} />
                        </Avatar>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          Assigned Employee
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600} color="success.main" pl={3.5}>
                        {appointment.employee.fullName}
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                {/* Action Buttons */}
                <Box 
                  sx={{ 
                    p: 2, 
                    pt: 0,
                    pb: 2.5,
                    display: 'flex',
                    gap: 1.5,
                  }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    size="medium"
                    startIcon={<EventRepeatIcon />}
                    onClick={() => handleOpenRescheduleModal(appointment)}
                    sx={{
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.25,
                      borderColor: 'warning.main',
                      color: 'warning.main',
                      '&:hover': {
                        borderColor: 'warning.dark',
                        bgcolor: 'warning.50',
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    Reschedule
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    size="medium"
                    onClick={() => handleOpenStatusDialog(appointment)}
                    sx={{
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.25,
                      background: `linear-gradient(135deg, ${
                        statusColors[appointment.status] === 'success' ? '#4caf50' :
                        statusColors[appointment.status] === 'error' ? '#f44336' :
                        statusColors[appointment.status] === 'warning' ? '#ff9800' :
                        statusColors[appointment.status] === 'info' ? '#2196f3' :
                        '#9c27b0'
                      } 0%, ${
                        statusColors[appointment.status] === 'success' ? '#66bb6a' :
                        statusColors[appointment.status] === 'error' ? '#e57373' :
                        statusColors[appointment.status] === 'warning' ? '#ffb74d' :
                        statusColors[appointment.status] === 'info' ? '#42a5f5' :
                        '#ba68c8'
                      } 100%)`,
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 3,
                      },
                    }}
                  >
                    Change Status
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 4,
                mb: 2,
              }}
            >
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Pagination 
                  count={totalPages} 
                  page={currentPage} 
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  siblingCount={1}
                  boundaryCount={1}
                />
              </Paper>
            </Box>
          )}
        </>
      )}

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Status Change Dialog */}
      <Dialog 
        open={statusDialogOpen} 
        onClose={handleCloseStatusDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Change Appointment Status
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Appointment #{selectedAppointment?.id} - {selectedAppointment?.customer.fullName}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>New Status</InputLabel>
              <Select
                value={newStatus}
                label="New Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="PENDING">
                  <Box display="flex" alignItems="center" gap={1}>
                    <HourglassEmptyIcon fontSize="small" color="warning" />
                    <span>Pending</span>
                  </Box>
                </MenuItem>
              
                <MenuItem value="APPROVE">
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircleIcon fontSize="small" color="success" />
                    <span>Approve</span>
                  </Box>
                </MenuItem>
                {/* <MenuItem value="CONFIRMED">
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircleIcon fontSize="small" color="info" />
                    <span>Confirmed</span>
                  </Box>
                </MenuItem> */}
                <MenuItem value="IN_PROGRESS">
                  <Box display="flex" alignItems="center" gap={1}>
                    <PlayArrowIcon fontSize="small" color="primary" />
                    <span>In Progress</span>
                  </Box>
                </MenuItem>
                {/* <MenuItem value="ONGOING">
                  <Box display="flex" alignItems="center" gap={1}>
                    <PlayArrowIcon fontSize="small" color="primary" />
                    <span>Ongoing</span>
                  </Box>
                </MenuItem> */}
                  <MenuItem value="COMPLETED">
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircleIcon fontSize="small" color="success" />
                    <span>Completed</span>
                  </Box>
                </MenuItem>
                <MenuItem value="REJECT">
                  <Box display="flex" alignItems="center" gap={1}>
                    <CancelIcon fontSize="small" color="error" />
                    <span>Reject</span>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notes (Optional)"
              placeholder="Add any notes about this status change. This will be included in the email sent to the customer."
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button 
            onClick={handleCloseStatusDialog}
            variant="outlined"
            disabled={statusChangeLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleStatusChange}
            variant="contained"
            disabled={statusChangeLoading || !newStatus || newStatus === selectedAppointment?.status}
            startIcon={statusChangeLoading ? <CircularProgress size={16} /> : null}
          >
            {statusChangeLoading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reschedule Modal */}
      {rescheduleAppointment && (
        <RescheduleModal
          open={rescheduleModalOpen}
          onClose={handleCloseRescheduleModal}
          appointment={rescheduleAppointment}
          onSuccess={handleRescheduleSuccess}
        />
      )}
    </Box>
  );
}
