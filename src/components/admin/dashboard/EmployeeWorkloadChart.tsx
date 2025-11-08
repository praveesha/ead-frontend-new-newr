import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";

interface EmployeeWorkloadData {
  employeeName: string;
  taskCount: number;
}

interface Props {
  data: EmployeeWorkloadData[];
}

export default function EmployeeWorkloadChart({ data }: Props) {
  const maxTasks = data.length ? Math.max(...data.map((d) => d.taskCount)) : 1;

  return (
    <Stack spacing={2}>
      {data.map((employee, index) => {
        const percentage = maxTasks > 0 ? (employee.taskCount / maxTasks) * 100 : 0;

        return (
          <Box key={index}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "var(--color-text-primary)", fontWeight: 600, mr: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {employee.employeeName}
              </Typography>
              <Typography variant="body2" sx={{ color: "var(--color-text-tertiary)" }}>
                {employee.taskCount}
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 10,
                borderRadius: 2,
                backgroundColor: "var(--color-border-subtle)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "var(--color-primary)",
                },
              }}
              aria-valuenow={Math.round(percentage)}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </Box>
        );
      })}

      {data.length === 0 && (
        <Typography variant="body2" sx={{ color: "var(--color-text-tertiary)" }}>
          No workload data available.
        </Typography>
      )}
    </Stack>
  );
}