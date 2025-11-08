import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import type { FormikHelpers } from "formik";
import type { AlertColor } from "@mui/material/Alert";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import DeleteDialog from "../../main/DeleteDialog";
import UserForm, { type UserFormValues } from "./UserForm";
import UserDataGrid, { type UserResponse } from "./UserDataGrid";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface DeleteDialogState {
  open: boolean;
  userId: number | null;
  userName: string;
}

interface PaginationModel {
  page: number;
  pageSize: number;
}

interface SortModel {
  field: string;
  sort: "asc" | "desc" | null;
}

export default function Users() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<SortModel[]>([
    { field: "id", sort: "desc" },
  ]);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    userId: null,
    userName: "",
  });

  const showSnackbar = (message: string, severity: AlertColor = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const sortField = sortModel[0]?.field || "id";
      const sortDirection = sortModel[0]?.sort || "desc";

      const response = await axiosInstance.get(API_PATHS.USER.GET_ALL, {
        params: {
          page: paginationModel.page,
          size: paginationModel.pageSize,
          sortBy: sortField,
          sortDirection: sortDirection,
        },
      });

      const { data, totalItems } = response.data;
      setUsers(data);
      setTotalRows(totalItems);
      console.log("Users fetched successfully:", response.data);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch users";
      showSnackbar(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [paginationModel, sortModel]);

  const handleSubmit = async (
    values: UserFormValues,
    { setSubmitting, resetForm }: FormikHelpers<UserFormValues>
  ) => {
    try {
      const response = await axiosInstance.post(API_PATHS.USER.CREATE, {
        email: values.email,
        password: values.password,
        role: values.role,
        enabled: true,
      });

      console.log("User created successfully:", response.data);

      showSnackbar("User created successfully!", "success");
      resetForm();
      fetchUsers(); // Refresh the user list
    } catch (error: any) {
      console.error("Error creating user:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create user";

      showSnackbar(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id: number, fullName: string) => {
    setDeleteDialog({
      open: true,
      userId: id,
      userName: fullName || "this user",
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.userId) return;

    setDeleteLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.USER.DELETE(deleteDialog.userId));

      showSnackbar("User deleted successfully!", "success");
      setDeleteDialog({ open: false, userId: null, userName: "" });
      fetchUsers(); // Refresh the user list
    } catch (error: any) {
      console.error("Error deleting user:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete user";
      showSnackbar(message, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, userId: null, userName: "" });
  };

  const handlePaginationModelChange = (newModel: PaginationModel) => {
    setPaginationModel(newModel);
  };

  // Accept model as GridSortModel (not array) to match UserDataGrid prop signature
  const handleSortModelChange = (model: any) => {
    setSortModel(model);
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
            }}
          >
            User Management
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "var(--color-text-tertiary)" }}
          >
            Add new users to the system
          </Typography>
        </Box>

        {/* User Form */}
        <UserForm onSubmit={handleSubmit} />

        {/* Users Data Grid */}
        <UserDataGrid
          users={users}
          loading={loading}
          rowCount={totalRows}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          onRefresh={fetchUsers}
          onDelete={handleDeleteClick}
        />

        {/* Delete Dialog */}
        <DeleteDialog
          open={deleteDialog.open}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          loading={deleteLoading}
          title="Delete User"
          message={`Are you sure you want to delete ${deleteDialog.userName}? This action cannot be undone.`}
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}