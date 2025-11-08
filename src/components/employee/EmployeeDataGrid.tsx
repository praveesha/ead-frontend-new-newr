import { useState } from "react";
import { Box, Typography, Stack, Chip, IconButton } from "@mui/material";
import {
  Visibility,
  Edit,
} from "@mui/icons-material";
import { type GridColDef } from "@mui/x-data-grid";
import CustomDataGrid from "../main/CustomDataGrid";
import { getStatusColor, getStatusIcon } from "../../helpers/colorhelper";
import DetailsDialog from "./DetailsDialog";
import UpdateDialog from "./UpdateDialog";

type AppointmentStatus =
  | "pending"
  | "approved"
  | "completed"
  | "rejected";

interface Appointment {
  id: number;
  date: string;
  time: string;
  service: string;
  vehicleType: string;
  vehicleNumber: string;
  instructions: string;
  status: AppointmentStatus;
  progress: number; 
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

interface EmployeeDataGridProps {
  appointments: Appointment[];
  loading: boolean;
  onUpdateProgress?: (appointmentId: number, progress: number) => Promise<void>;
}

export default function EmployeeDataGrid({
  appointments,
  loading,
  onUpdateProgress,
}: EmployeeDataGridProps) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const handleViewClick = (appointment: Appointment) => {
    console.log("View clicked for appointment:", appointment);
    setSelectedAppointment(appointment);
    setOpenViewDialog(true);
  };

  const handleUpdateClick = (appointment: Appointment) => {
    console.log("Update clicked for appointment:", appointment);
    setSelectedAppointment(appointment);
    setOpenUpdateDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedAppointment(null);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setSelectedAppointment(null);
  };

  const handleUpdateProgress = async (
    appointmentId: number,
    progress: number
  ) => {
    if (onUpdateProgress) {
      await onUpdateProgress(appointmentId, progress);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 25) return "#dc2626";
    if (progress < 50) return "#f59e0b";
    if (progress < 75) return "#3b82f6";
    return "#10b981";
  };

  const columns: GridColDef<Appointment>[] = [
    {
      field: "date",
      headerName: "Date",
      width: 130,
    },
    {
      field: "time",
      headerName: "Time",
      width: 120,
    },
    {
      field: "customerName",
      headerName: "Customer",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "service",
      headerName: "Service",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => {
        const StatusIcon = getStatusIcon(params.value);
        return (
          <Chip
            icon={<StatusIcon sx={{ fontSize: 16 }} />}
            label={params.value.toUpperCase()}
            color={getStatusColor(params.value)}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      },
    },
    {
      field: "progress",
      headerName: "Progress",
      width: 130,
      renderCell: (params) => (
        <Box sx={{ width: "100%" }}>
          <Stack direction="row">
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: getProgressColor(params.value),
              }}
            >
              {params.value}%
            </Typography>
          </Stack>
          <Box
            sx={{
              width: "100%",
              height: 4,
              bgcolor: "rgba(212, 212, 216, 0.2)",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${params.value}%`,
                height: "100%",
                bgcolor: getProgressColor(params.value),
                transition: "all 0.3s ease",
              }}
            />
          </Box>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton
            onClick={() => handleViewClick(params.row)}
            size="small"
            sx={{
              color: "var(--color-primary)",
              "&:hover": {
                bgcolor: "rgba(214, 5, 7, 0.1)",
              },
            }}
          >
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => handleUpdateClick(params.row)}
            size="small"
            sx={{
              color: "#3b82f6",
              "&:hover": {
                bgcolor: "rgba(59, 130, 246, 0.1)",
              },
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <Box
        sx={{
          borderRadius: 3,
          p: 3,
          border: "1px solid rgba(212, 212, 216, 0.2)",
        }}
      >
        <CustomDataGrid
          rows={appointments}
          columns={columns}
          loading={loading}
          pageSize={10}
          pageSizeOptions={[10, 25, 50, 100]}
          sx={{
            // Vertically center all cells
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
            },
            // Optional: center headers vertically too
            '& .MuiDataGrid-columnHeaders': {
              alignItems: 'center',
            },
            '& .MuiDataGrid-columnHeaderTitleContainer': {
              alignItems: 'center',
            },
          }}
        />
      </Box>

      {/* View Appointment Dialog */}
      <DetailsDialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        appointment={selectedAppointment}
      />

      {/* Update Progress Dialog */}
      <UpdateDialog
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
        appointment={selectedAppointment}
        onUpdate={handleUpdateProgress}
      />
    </>
  );
}

export type { Appointment };
