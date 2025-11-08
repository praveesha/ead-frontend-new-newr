import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Fade,
  Tooltip,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { appointmentService } from "../../../services/appointmentService";
import type {
  Appointment,
  GroupedAppointments,
  User,
} from "../../../types/appointment";
import ConfirmedAppointmentsList from "./ConfirmedAppointmentsList";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import EmployeeSelectionModal from "./EmployeeSelectionModal";
import axiosInstance from "../../../utils/axiosInstance";

const TaskAllocationPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [groupedAppointments, setGroupedAppointments] = useState<
    GroupedAppointments[]
  >([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  // Modal states
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [isAllocating, setIsAllocating] = useState(false);

  // Fetch approved appointments (changed from CONFIRMED to APPROVED)
  useEffect(() => {
    fetchApprovedAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchApprovedAppointments = async () => {
    try {
      setIsLoading(true);
      // Changed from 'CONFIRMED' to 'APPROVED'
      const data = await appointmentService.getByStatus("APPROVE");

      console.log("📋 Fetched approved appointments:", data);

      setAppointments(data);

      // ✅ FIX: Call grouping and set state
      const grouped = groupAppointmentsByCustomer(data);
      console.log("👥 Grouped result:", grouped);

      setGroupedAppointments(grouped);
    } catch (err: unknown) {
      console.error("❌ Error fetching appointments:", err);
      let errorMessage = "Failed to load appointments";
      if (err && typeof err === "object" && "response" in err) {
        const response = (err as { response?: { data?: { message?: string } } })
          .response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const groupAppointmentsByCustomer = (
    appointments: Appointment[]
  ): GroupedAppointments[] => {
    const grouped = appointments.reduce(
      (acc, appointment) => {
        // Extract customer info from nested customer object OR direct fields
        const customerEmail =
          appointment.customer?.email ||
          appointment.customerEmail ||
          "anonymous";

        const customerName =
          appointment.customer?.fullName ||
          appointment.customerName ||
          "Unknown Customer";

        const customerId = appointment.customer?.id || appointment.customerId;

        if (!acc[customerEmail]) {
          acc[customerEmail] = {
            customerId,
            customerName,
            customerEmail,
            totalCount: 0,
            appointments: [],
          };
        }

        acc[customerEmail].appointments.push(appointment);
        acc[customerEmail].totalCount++;

        return acc;
      },
      {} as Record<string, GroupedAppointments>
    );

    return Object.values(grouped);
  };

  // Handle appointment card click
  const handleAppointmentClick = async (appointmentId: number) => {
    try {
      const appointment = await appointmentService.getById(appointmentId);
      setSelectedAppointment(appointment);
      setShowDetailsModal(true);
    } catch (err: unknown) {
      console.error("Error fetching appointment details:", err);
      setSnackbarMessage("Failed to load appointment details");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handle allocate button click
  const handleAllocateClick = async () => {
    try {
      setIsLoadingEmployees(true);
      const employeeData = await appointmentService.getAvailableEmployees();
      setEmployees(employeeData);
      setShowEmployeeModal(true);
    } catch (err: unknown) {
      console.error("Error fetching employees:", err);
      setSnackbarMessage("Failed to load employees");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  // Handle employee selection
  const handleEmployeeSelect = async (employeeId: number) => {
    if (!selectedAppointment) return;

    try {
      setIsAllocating(true);

      // Step 1: Allocate appointment to employee
      await appointmentService.allocateToEmployee(
        selectedAppointment.id,
        employeeId
      );

      // Step 2: Change status to IN_PROGRESS after successful allocation
      try {
        await axiosInstance.patch(
          `/appointments/${selectedAppointment.id}/status`,
          {
            status: "IN_PROGRESS",
            notes: `Appointment has been assigned to an employee and is now in progress.`,
          }
        );
        console.log("✅ Status changed to IN_PROGRESS");
      } catch (statusError) {
        console.error(
          "⚠️ Warning: Failed to update status to IN_PROGRESS:",
          statusError
        );
        // Continue even if status update fails
      }

      // Show success message
      const employeeName = employees.find((e) => e.id === employeeId)?.fullName;
      setSnackbarMessage(
        `Successfully allocated to ${employeeName} and status updated to In Progress`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Close modals
      setShowEmployeeModal(false);
      setShowDetailsModal(false);

      // Refresh appointments list
      await fetchApprovedAppointments();
    } catch (err: unknown) {
      console.error("Error allocating appointment:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to allocate appointment";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsAllocating(false);
    }
  };

  // Close modals
  const closeModals = () => {
    setShowDetailsModal(false);
    setShowEmployeeModal(false);
    setSelectedAppointment(null);
  };

  // Handle Snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Task Allocation
          </Typography>
          <Tooltip title="Refresh appointments">
            <IconButton
              onClick={fetchApprovedAppointments}
              color="primary"
              sx={{
                bgcolor: "action.hover",
                "&:hover": { bgcolor: "action.selected" },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Allocate approved appointments to available employees
        </Typography>

        {/* Stats Cards */}
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          <Card elevation={2}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Total Appointments
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {appointments.length}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    bgcolor: "primary.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AssignmentIcon
                    sx={{ fontSize: 32, color: "var(--color-text-primary)" }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={2}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Unique Customers
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {groupedAppointments.length}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    bgcolor: "success.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PeopleIcon
                    sx={{ fontSize: 32, color: "var(--color-text-primary)" }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={2}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Status
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="success.main"
                    >
                      Approved
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    bgcolor: "warning.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircleIcon
                    sx={{ fontSize: 32, color: "var(--color-text-primary)" }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Main Content */}
      <Fade in={!isLoading} timeout={500}>
        <Box>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 8,
              }}
            >
              <CircularProgress size={60} />
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                Loading approved appointments...
              </Typography>
            </Box>
          ) : (
            <ConfirmedAppointmentsList
              groupedAppointments={groupedAppointments}
              onAppointmentClick={handleAppointmentClick}
            />
          )}
        </Box>
      </Fade>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          open={showDetailsModal}
          appointment={selectedAppointment}
          onClose={closeModals}
          onAllocate={handleAllocateClick}
          isAllocating={isLoadingEmployees}
        />
      )}

      {/* Employee Selection Modal */}
      {showEmployeeModal && (
        <EmployeeSelectionModal
          open={showEmployeeModal}
          employees={employees}
          onClose={() => setShowEmployeeModal(false)}
          onSelect={handleEmployeeSelect}
          isLoading={isAllocating}
        />
      )}

      {/* Snackbar for Toast Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TaskAllocationPage;
