import { createTheme } from "@mui/material/styles";

// Augment the theme to include DataGrid component overrides
declare module "@mui/material/styles" {
  interface ComponentNameToClassKey {
    MuiDataGrid: any;
  }
  interface ComponentsPropsList {
    MuiDataGrid: any;
  }
  interface Components {
    MuiDataGrid?: {
      defaultProps?: any;
      styleOverrides?: any;
      variants?: any;
    };
  }
}

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  defaultColorScheme: "dark",
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#D60507",
          light: "#EF4444",
          dark: "#B91C1C",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#D60507",
          light: "#DC2626",
          dark: "#B91C1C",
          contrastText: "#FFFFFF",
        },
        background: {
          default: "#FFFFFF",
          paper: "#F9FAFB",
        },
        text: {
          primary: "#1F2937",
          secondary: "#6B7280",
        },
        error: {
          main: "#DC2626",
          light: "#EF4444",
          dark: "#B91C1C",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#F59E0B",
          light: "#FBBF24",
          dark: "#D97706",
          contrastText: "#FFFFFF",
        },
        info: {
          main: "#3B82F6",
          light: "#60A5FA",
          dark: "#2563EB",
          contrastText: "#FFFFFF",
        },
        success: {
          main: "#10B981",
          light: "#34D399",
          dark: "#059669",
          contrastText: "#FFFFFF",
        },
        divider: "rgba(212, 212, 216, 0.2)",
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#D60507",
          light: "#EF4444",
          dark: "#B91C1C",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#D60507",
          light: "#DC2626",
          dark: "#B91C1C",
          contrastText: "#FFFFFF",
        },
        background: {
          default: "#020202",
          paper: "#171717",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#D4D4D8",
        },
        error: {
          main: "#EF4444",
          light: "#F87171",
          dark: "#DC2626",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#FBBF24",
          light: "#FCD34D",
          dark: "#F59E0B",
          contrastText: "#000000",
        },
        info: {
          main: "#60A5FA",
          light: "#93C5FD",
          dark: "#3B82F6",
          contrastText: "#000000",
        },
        success: {
          main: "#34D399",
          light: "#6EE7B7",
          dark: "#10B981",
          contrastText: "#000000",
        },
        divider: "rgba(212, 212, 216, 0.2)",
      },
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          "--DataGrid-borderColor": "#000000",
          '[data-toolpad-color-scheme="dark"] &': {
            "--DataGrid-borderColor": "#E0E3E7",
          },
          border: "1px solid var(--DataGrid-borderColor)",
          borderRadius: "10px",
          // Remove these - they should be applied via sx prop on the DataGrid component
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-columnHeaders": {
            alignItems: "center",
          },
          "& .MuiDataGrid-columnHeaderTitleContainer": {
            alignItems: "center",
          },
        },
        columnHeaders: {
          borderBottom: "1px solid var(--DataGrid-borderColor)",
          "& .MuiDataGrid-columnHeader.last-column .MuiDataGrid-columnSeparator": {
            display: "none",
          },
        },
        cell: {
          borderBottom: "1px solid var(--DataGrid-borderColor)",
        },
        columnSeparator: {
          color: "var(--DataGrid-borderColor)",
        },
        iconSeparator: {
          color: "var(--DataGrid-borderColor)",
        },
        footerContainer: {
          "& .MuiSvgIcon-root": {
            color: "var(--DataGrid-borderColor)",
          },
        },
      },
    },
  },
});

export default theme;
