import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Avatar,
  Chip,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingIcon,
  PlayArrow as PlayArrowIcon,
  ThumbUp as ApprovedIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import axiosInstance from '../../../utils/axiosInstance';
import EmployeeAppointmentsModal from './EmployeeAppointmentsModal';

interface TaskStats {
  pending: number;
  approved: number;
  inProgress: number;
  completed: number;
  ongoing: number;
  total: number;
}

interface Employee {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  enabled: boolean;
  taskStats: TaskStats;
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  useEffect(() => {
    fetchEmployees();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Filter employees based on search query
    if (searchQuery.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = employees.filter((employee) => {
        return (
          employee.fullName.toLowerCase().includes(query) ||
          employee.email.toLowerCase().includes(query) ||
          (employee.phone && employee.phone.toLowerCase().includes(query))
        );
      });
      setFilteredEmployees(filtered);
    }
  }, [searchQuery, employees]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users/employees');
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      showSnackbar('Failed to load employees', 'error');
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

  const handleOpenModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEmployee(null);
  };

  const getWorkloadColor = (inProgress: number) => {
    if (inProgress === 0) return 'success';
    if (inProgress <= 3) return 'info';
    if (inProgress <= 6) return 'warning';
    return 'error';
  };

  const calculateWorkloadPercentage = (employee: Employee) => {
    const maxWorkload = 10; // Assume 10 is high workload
    return Math.min((employee.taskStats.inProgress / maxWorkload) * 100, 100);
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
          <WorkIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight={700} color="primary.main">
            Employee Management
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          View all employees and their current workload statistics
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
            placeholder="Search by name, email, or phone..."
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
                  Found <strong>{filteredEmployees.length}</strong> employee{filteredEmployees.length !== 1 ? 's' : ''}
                </>
              ) : (
                <>
                  Total: <strong>{employees.length}</strong> employee{employees.length !== 1 ? 's' : ''}
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

      {/* Employees Grid */}
      {filteredEmployees.length === 0 ? (
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
          <PersonIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchQuery ? 'No employees found' : 'No employees available'}
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {searchQuery ? 'Try adjusting your search terms' : 'Employees will appear here'}
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {filteredEmployees.map((employee) => (
            <Card
              key={employee.id}
                elevation={0}
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease-in-out',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                    borderColor: 'primary.main',
                  },
                }}
              >
                {/* Header with Avatar */}
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    p: 3,
                    color: 'white',
                    textAlign: 'center',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'rgba(255, 255, 255, 0.25)',
                      border: '3px solid rgba(255, 255, 255, 0.5)',
                      fontSize: '2rem',
                      fontWeight: 700,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {employee.fullName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {employee.fullName}
                  </Typography>
                  <Chip
                    label={employee.role}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.25)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 2.5 }}>
                  {/* Contact Information */}
                  <Box mb={2.5}>
                    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                      <EmailIcon sx={{ fontSize: 18, color: 'action.active' }} />
                      <Typography variant="body2" color="text.primary">
                        {employee.email}
                      </Typography>
                    </Box>
                    {employee.phone && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <PhoneIcon sx={{ fontSize: 18, color: 'action.active' }} />
                        <Typography variant="body2" color="text.primary">
                          {employee.phone}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Workload Section */}
                  <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                      <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                        Current Workload
                      </Typography>
                      <Chip
                        label={`${employee.taskStats.inProgress} Active`}
                        size="small"
                        color={getWorkloadColor(employee.taskStats.inProgress)}
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>

                    {/* Workload Progress Bar */}
                    <Box mb={2}>
                      <LinearProgress
                        variant="determinate"
                        value={calculateWorkloadPercentage(employee)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background:
                              employee.taskStats.inProgress === 0
                                ? 'linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)'
                                : employee.taskStats.inProgress <= 3
                                ? 'linear-gradient(90deg, #2196f3 0%, #42a5f5 100%)'
                                : employee.taskStats.inProgress <= 6
                                ? 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)'
                                : 'linear-gradient(90deg, #f44336 0%, #e57373 100%)',
                          },
                        }}
                      />
                    </Box>

                    {/* Task Statistics */}
                    <Box display="flex" flexDirection="column" gap={1.5}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1}>
                          <PendingIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            Pending
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={600}>
                          {employee.taskStats.pending}
                        </Typography>
                      </Box>

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1}>
                          <ApprovedIcon sx={{ fontSize: 16, color: 'success.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            Approved
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={600}>
                          {employee.taskStats.approved}
                        </Typography>
                      </Box>

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1}>
                          <PlayArrowIcon sx={{ fontSize: 16, color: 'info.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            In Progress
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={600}>
                          {employee.taskStats.inProgress}
                        </Typography>
                      </Box>

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1}>
                          <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            Completed
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={600}>
                          {employee.taskStats.completed}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 0.5 }} />

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          p: 1,
                          bgcolor: 'background.default',
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                          Workload
                        </Typography>
                        <Chip
                          label={`${employee.taskStats.inProgress} active`}
                          size="small"
                          color={getWorkloadColor(employee.taskStats.inProgress)}
                        />
                      </Box>

                      {/* Workload Progress Bar */}
                      <Box sx={{ mt: 1.5 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                          <Typography variant="caption" color="text.secondary">
                            Capacity
                          </Typography>
                          <Typography variant="caption" fontWeight={600} color="text.secondary">
                            {calculateWorkloadPercentage(employee).toFixed(0)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={calculateWorkloadPercentage(employee)}
                          color={getWorkloadColor(employee.taskStats.inProgress)}
                          sx={{ height: 6, borderRadius: 1 }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* View Appointments Button */}
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CalendarIcon />}
                    onClick={() => handleOpenModal(employee)}
                    sx={{
                      mt: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        bgcolor: 'primary.50',
                      },
                    }}
                  >
                    View Appointments
                  </Button>
                </CardContent>
              </Card>
          ))}
        </Box>
      )}

      {/* Employee Appointments Modal */}
      {selectedEmployee && (
        <EmployeeAppointmentsModal
          open={modalOpen}
          onClose={handleCloseModal}
          employeeId={selectedEmployee.id}
          employeeName={selectedEmployee.fullName}
        />
      )}

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
