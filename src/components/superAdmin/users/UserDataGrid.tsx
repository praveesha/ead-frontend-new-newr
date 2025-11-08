import { Paper, Typography, Stack, IconButton, Chip } from "@mui/material";
import { type GridColDef,type  GridPaginationModel, type GridSortModel } from "@mui/x-data-grid";
import { Refresh } from "@mui/icons-material";
import CustomDataGrid from "../../main/CustomDataGrid";

interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserDataGridProps {
  users: UserResponse[];
  loading: boolean;
  rowCount: number;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  onRefresh: () => void;
  onDelete: (id: number, fullName: string) => void;
}

export default function UserDataGrid({
  users,
  loading,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  onRefresh,
}: UserDataGridProps) {
  const columns: GridColDef<UserResponse>[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      type: "number",
    },
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "role",
      headerName: "Role",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "ADMIN" ? "primary" : "default"}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: "enabled",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "default"}
          size="small"
          variant="outlined"
        />
      ),
    },
    
  ];

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "1.1rem", md: "1.25rem" },
          }}
        >
          Users List
        </Typography>
        <IconButton
          onClick={onRefresh}
          disabled={loading}
          color="primary"
          size="small"
        >
          <Refresh />
        </IconButton>
      </Stack>

      <CustomDataGrid
        rows={users}
        columns={columns}
        loading={loading}
        rowCount={rowCount}
        paginationMode="server"
        sortingMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        pageSizeOptions={[10, 25, 50, 100]}
        disableRowSelectionOnClick
      />
    </Paper>
  );
}

export type { UserResponse };