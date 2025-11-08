import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface ServiceStatusData {
  status: string;
  count: number;
}

interface Props {
  data: ServiceStatusData[];
}

export default function ServiceStatusChart({ data }: Props) {
  const total = data.reduce((sum, item) => sum + item.count, 0) || 1;

  const getColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "var(--color-primary)"; // primary (red)
      case "IN_PROGRESS":
        return "var(--color-text-secondary)"; // secondary text (lighter)
      case "PENDING":
        return "var(--color-text-tertiary)"; // tertiary text (muted)
      default:
        return "var(--color-border-secondary)";
    }
  };

  const getPercentage = (count: number) => ((count / total) * 100).toFixed(1);

  // Build svg segments
  let offset = 0;
  const segments = data.map((item, idx) => {
    const pct = (item.count / total) * 100;
    const seg = {
      ...item,
      pct,
      dashArray: `${pct} ${100 - pct}`,
      dashOffset: 100 - offset,
      color: getColor(item.status),
      key: `${item.status}-${idx}`,
    };
    offset += pct;
    return seg;
  });

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 3,
        alignItems: "center",
        justifyContent: "center",
        px: 1,
      }}
    >
      {/* Donut chart */}
      <Box
        sx={{
          width: { xs: 180, sm: 220, md: 260 },
          height: { xs: 180, sm: 220, md: 260 },
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
        aria-hidden={false}
        role="img"
        aria-label="Service status donut chart"
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="dont-rotate">
          <g transform="rotate(-90 50 50)">
            {segments.map((s) => (
              <circle
                key={s.key}
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke={s.color}
                strokeWidth="20"
                strokeDasharray={s.dashArray}
                strokeDashoffset={s.dashOffset}
                strokeLinecap="butt"
              />
            ))}
          </g>
        </svg>

        {/* Center summary */}
        <Box
          sx={{
            position: "absolute",
            textAlign: "center",
            left: 0,
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            px: 1,
          }}
        >
          <Typography sx={{ fontSize: { xs: 14, sm: 15 } }}>
            TOTAL
          </Typography>
          <Typography sx={{ fontSize: { xs: 20, sm: 22 }, fontWeight: 700}}>
            {data.reduce((s, i) => s + i.count, 0)}
          </Typography>
        </Box>
      </Box>

      {/* Legend */}
      <Stack spacing={1.25} sx={{ width: { xs: "100%", sm: "45%", md: "40%" } }}>
        {data.map((item) => (
          <Box
            key={item.status}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 1, sm: 0 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: getColor(item.status),
                  flexShrink: 0,
                }}
                aria-hidden
              />
              <Typography sx={{ fontSize: { xs: 13, sm: 14 },textTransform: "capitalize" }}>
                {item.status.replace("_", " ").toLowerCase()}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: { xs: 13, sm: 14 }, minWidth: 48, textAlign: "right" }}>
                {item.count}
              </Typography>
              <Typography sx={{ fontSize: { xs: 12, sm: 13 }, color: "var(--color-text-tertiary)" }}>
                {getPercentage(item.count)}%
              </Typography>
            </Box>
          </Box>
        ))}

        {data.length === 0 && (
          <Typography>No status data available.</Typography>
        )}
      </Stack>
    </Box>
  );
}