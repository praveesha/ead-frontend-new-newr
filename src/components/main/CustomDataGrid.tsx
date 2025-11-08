import type { JSX } from "react/jsx-runtime";
import {
  DataGrid,
  type GridColDef,
  type GridValidRowModel,
  type DataGridProps,
} from "@mui/x-data-grid";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function CustomNoRowsOverlay(): JSX.Element {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <Typography sx={{ m: 5 }} variant="body1" color="text.secondary">
        No rows
      </Typography>
    </Box>
  );
}

export type CustomDataGridProps<R extends GridValidRowModel = GridValidRowModel> = {
  rows: R[];
  columns: GridColDef<R>[];
  pageSize?: number;
  pageSizeOptions?: number[];
} & Omit<DataGridProps<R>, "rows" | "columns" | "pageSize" | "pageSizeOptions">;

export default function CustomDataGrid<R extends GridValidRowModel = GridValidRowModel>(
  {
    rows,
    columns,
    pageSize = 10,
    pageSizeOptions = [10, 50, 100],
    initialState,
    ...props
  }: CustomDataGridProps<R>
): JSX.Element {
  return (
    <Box sx={{ height: 600, width: "100%" }}> {/* Fixed height instead of "auto" */}
      <DataGrid<R>
        rows={rows}
        columns={columns}
        sx={{
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-columnHeaders': {
            alignItems: 'center',
          },
          '& .MuiDataGrid-columnHeaderTitleContainer': {
            alignItems: 'center',
          },
          ...props.sx,
        }}
        pageSizeOptions={pageSizeOptions}
        initialState={
          initialState ?? {
            pagination: { paginationModel: { page: 0, pageSize } },
          }
        }
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        autoHeight={false} // Disable autoHeight
        {...props}
      />
    </Box>
  );
}
