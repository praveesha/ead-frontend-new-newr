import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  DirectionsCar as CarIcon,
  Build as BuildIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axiosInstance from '../../../utils/axiosInstance';

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

interface TaskBreakdownItem {
  taskName: string;
  price: number;
}

interface InvoiceData {
  appointmentId: number;
  taskBreakdown: TaskBreakdownItem[];
  totalPrice: number;
  sendToCustomer: boolean;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '0.875rem',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function Invoices() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Invoice generation dialog state
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [taskBreakdown, setTaskBreakdown] = useState<TaskBreakdownItem[]>([
    { taskName: '', price: 0 },
  ]);
  const [sendToCustomer, setSendToCustomer] = useState(true);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  useEffect(() => {
    fetchCompletedAppointments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          appointment.service.toLowerCase().includes(query)
        );
      });
      setFilteredAppointments(filtered);
    }
  }, [searchQuery, appointments]);

  const fetchCompletedAppointments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/appointments/status/completed');
      setAppointments(response.data);
      setFilteredAppointments(response.data);
    } catch (error) {
      console.error('Error fetching completed appointments:', error);
      showSnackbar('Failed to load completed appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleOpenInvoiceDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setTaskBreakdown([{ taskName: appointment.service, price: 0 }]);
    setSendToCustomer(true);
    setInvoiceDialogOpen(true);
  };

  const handleCloseInvoiceDialog = () => {
    setInvoiceDialogOpen(false);
    setSelectedAppointment(null);
    setTaskBreakdown([{ taskName: '', price: 0 }]);
    setSendToCustomer(true);
  };

  const handleAddTask = () => {
    setTaskBreakdown([...taskBreakdown, { taskName: '', price: 0 }]);
  };

  const handleRemoveTask = (index: number) => {
    if (taskBreakdown.length > 1) {
      const newTasks = taskBreakdown.filter((_, i) => i !== index);
      setTaskBreakdown(newTasks);
    }
  };

  const handleTaskChange = (index: number, field: 'taskName' | 'price', value: string | number) => {
    const newTasks = [...taskBreakdown];
    if (field === 'price') {
      newTasks[index][field] = parseFloat(value.toString()) || 0;
    } else {
      newTasks[index][field] = value.toString();
    }
    setTaskBreakdown(newTasks);
  };

  const calculateTotal = () => {
    return taskBreakdown.reduce((sum, task) => sum + task.price, 0);
  };

  const handleGenerateInvoice = async () => {
    if (!selectedAppointment) return;

    // Validation
    const hasEmptyTasks = taskBreakdown.some(task => !task.taskName.trim() || task.price <= 0);
    if (hasEmptyTasks) {
      showSnackbar('Please fill in all task names and prices', 'error');
      return;
    }

    const totalPrice = calculateTotal();
    if (totalPrice <= 0) {
      showSnackbar('Total price must be greater than 0', 'error');
      return;
    }

    const invoiceData: InvoiceData = {
      appointmentId: selectedAppointment.id,
      taskBreakdown: taskBreakdown,
      totalPrice: totalPrice,
      sendToCustomer: sendToCustomer,
    };

    try {
      setGeneratingInvoice(true);
      
      const response = await axiosInstance.post('/invoices/generate', invoiceData, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${selectedAppointment.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      const message = sendToCustomer 
        ? 'Invoice generated and sent to customer email!' 
        : 'Invoice downloaded successfully!';
      showSnackbar(message, 'success');
      handleCloseInvoiceDialog();
    } catch (error) {
      console.error('Error generating invoice:', error);
      showSnackbar('Failed to generate invoice. Please try again.', 'error');
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight={700} color="primary.main">
            Invoice Management
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Generate and manage invoices for completed appointments
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
            placeholder="Search by appointment ID, customer name, email, vehicle number..."
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
              },
            }}
            size="medium"
          />

          {/* Search Results Info */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? (
                <>
                  Found <strong>{filteredAppointments.length}</strong> result{filteredAppointments.length !== 1 ? 's' : ''}
                </>
              ) : (
                <>
                  Total: <strong>{appointments.length}</strong> completed appointment{appointments.length !== 1 ? 's' : ''}
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

      {/* Appointments Table */}
      {filteredAppointments.length === 0 ? (
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
          <ReceiptIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchQuery ? 'No appointments found' : 'No completed appointments'}
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'Completed appointments will appear here'}
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
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Appointment ID</StyledTableCell>
                <StyledTableCell>Customer</StyledTableCell>
                <StyledTableCell>Date & Time</StyledTableCell>
                <StyledTableCell>Vehicle</StyledTableCell>
                <StyledTableCell>Service</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <StyledTableRow key={appointment.id}>
                  <StyledTableCell>
                    <Chip
                      label={`#${appointment.id}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        <PersonIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {appointment.customer.fullName}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <EmailIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {appointment.customer.email}
                          </Typography>
                        </Box>
                        {appointment.customer.phone && (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <PhoneIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {appointment.customer.phone}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                      <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {formatDate(appointment.date)}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(appointment.time)}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <CarIcon sx={{ fontSize: 16, color: 'action.active' }} />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {appointment.vehicleType.toUpperCase()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {appointment.vehicleNumber}
                        </Typography>
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <BuildIcon sx={{ fontSize: 16, color: 'action.active' }} />
                      <Typography variant="body2">
                        {appointment.service}
                      </Typography>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      label="COMPLETED"
                      size="small"
                      color="success"
                      sx={{ fontWeight: 600 }}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ReceiptIcon />}
                      onClick={() => handleOpenInvoiceDialog(appointment)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Generate Invoice
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Invoice Generation Dialog */}
      <Dialog
        open={invoiceDialogOpen}
        onClose={handleCloseInvoiceDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <ReceiptIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Generate Invoice
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Appointment #{selectedAppointment?.id} - {selectedAppointment?.customer.fullName}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Divider sx={{ my: 2 }} />

          {/* Appointment Details */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              bgcolor: 'primary.50',
              border: 1,
              borderColor: 'primary.100',
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
              Appointment Details
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              <Box flex={1} minWidth={200}>
                <Typography variant="caption" color="text.secondary">
                  Date & Time
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {selectedAppointment && formatDate(selectedAppointment.date)} at{' '}
                  {selectedAppointment && formatTime(selectedAppointment.time)}
                </Typography>
              </Box>
              <Box flex={1} minWidth={200}>
                <Typography variant="caption" color="text.secondary">
                  Vehicle
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {selectedAppointment?.vehicleType.toUpperCase()} - {selectedAppointment?.vehicleNumber}
                </Typography>
              </Box>
              <Box flex={1} minWidth={200}>
                <Typography variant="caption" color="text.secondary">
                  Service
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {selectedAppointment?.service}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Task Breakdown */}
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Service Breakdown
          </Typography>

          {taskBreakdown.map((task, index) => (
            <Box key={index} display="flex" gap={2} mb={2}>
              <TextField
                fullWidth
                label="Task Name"
                value={task.taskName}
                onChange={(e) => handleTaskChange(index, 'taskName', e.target.value)}
                placeholder="e.g., Oil Change, Brake Inspection"
                size="small"
              />
              <TextField
                label="Price ($)"
                type="number"
                value={task.price || ''}
                onChange={(e) => handleTaskChange(index, 'price', e.target.value)}
                placeholder="0.00"
                size="small"
                sx={{ width: 150 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              <IconButton
                color="error"
                onClick={() => handleRemoveTask(index)}
                disabled={taskBreakdown.length === 1}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddTask}
            variant="outlined"
            size="small"
            sx={{ mb: 3 }}
          >
            Add Task
          </Button>

          {/* Total */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: 'success.50',
              border: 2,
              borderColor: 'success.main',
              borderRadius: 2,
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                Total Amount
              </Typography>
              <Typography variant="h5" fontWeight={700} color="success.main">
                ${calculateTotal().toFixed(2)}
              </Typography>
            </Box>
          </Paper>

          {/* Send to Customer Option */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: 'background.default',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1}>
                <EmailIcon color="action" />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Send to Customer Email
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Invoice will be sent to {selectedAppointment?.customer.email}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant={sendToCustomer ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setSendToCustomer(!sendToCustomer)}
                sx={{ minWidth: 100 }}
              >
                {sendToCustomer ? 'Yes' : 'No'}
              </Button>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={handleCloseInvoiceDialog} variant="outlined" disabled={generatingInvoice}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerateInvoice}
            variant="contained"
            disabled={generatingInvoice}
            startIcon={
              generatingInvoice ? (
                <CircularProgress size={16} color="inherit" />
              ) : sendToCustomer ? (
                <SendIcon />
              ) : (
                <DownloadIcon />
              )
            }
            sx={{ minWidth: 180 }}
          >
            {generatingInvoice
              ? 'Generating...'
              : sendToCustomer
              ? 'Generate & Send'
              : 'Generate & Download'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
