import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface MonthlyTrendData {
  month: string;
  value: number;
}

interface Props {
  data: MonthlyTrendData[];
  title?: string;
}

export default function MonthlyTrendChart({ data, title = "Monthly Trend" }: Props) {
  const height = 300;
  const width = 600;
  const padding = 40;

  const safeData = data && data.length ? data : [{ month: "", value: 0 }];

  const maxValue = useMemo(() => {
    const m = Math.max(...safeData.map((d) => d.value), 1);
    return m === 0 ? 1 : m;
  }, [safeData]);

  const points = useMemo(() => {
    const len = safeData.length;
    const xStep = len > 1 ? (width - padding * 2) / (len - 1) : 0;
    const yScale = (height - padding * 2) / maxValue;

    return safeData
      .map((d, i) => {
        const x = padding + i * xStep;
        const y = height - padding - d.value * yScale;
        return `${x},${y}`;
      })
      .join(" ");
  }, [safeData, maxValue]);

  const tickCount = 4;
  const ticks = useMemo(() => {
    return Array.from({ length: tickCount }, (_, i) =>
      Math.round((maxValue / (tickCount - 1)) * i)
    );
  }, [maxValue]);

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ color: "var(--color-primary)", fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: { xs: 220, sm: 260, md: 300 },
          bgcolor: "transparent",
          overflow: "hidden",
        }}
        role="img"
        aria-label={`${title} chart`}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMinYMin meet"
        >
          {/* Grid lines */}
          {ticks.map((tick) => {
            const y = height - padding - (tick / maxValue) * (height - padding * 2);
            return (
              <line
                key={`grid-${tick}`}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="var(--color-border-subtle)"
                strokeWidth="1"
              />
            );
          })}

          {/* Area under line (subtle fill) */}
          <polyline
            points={`${points} ${width - padding},${height - padding} ${padding},${height - padding}`}
            fill="rgba(214,5,7,0.06)"
            stroke="none"
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {safeData.map((d, i) => {
            const len = safeData.length;
            const xStep = len > 1 ? (width - padding * 2) / (len - 1) : 0;
            const yScale = (height - padding * 2) / maxValue;
            const x = padding + i * xStep;
            const y = height - padding - d.value * yScale;
            return <circle key={`pt-${i}`} cx={x} cy={y} r="4.5" fill="var(--color-primary)" stroke="var(--color-bg-header)" strokeWidth="1" />;
          })}

          {/* X-axis labels */}
          {safeData.map((d, i) => {
            const len = safeData.length;
            const xStep = len > 1 ? (width - padding * 2) / (len - 1) : 0;
            const x = padding + i * xStep;
            return (
              <text
                key={`xlab-${i}`}
                x={x}
                y={height - padding + 18}
                textAnchor="middle"
                fontSize="12"
                fill="var(--color-text-tertiary)"
              >
                {d.month}
              </text>
            );
          })}

          {/* Y-axis ticks */}
          {ticks.map((tick) => {
            const y = height - padding - (tick / maxValue) * (height - padding * 2) + 4;
            return (
              <text
                key={`ylab-${tick}`}
                x={padding - 10}
                y={y}
                textAnchor="end"
                fontSize="12"
                fill="var(--color-text-tertiary)"
              >
                {tick}
              </text>
            );
          })}
        </svg>
      </Box>
    </Box>
  );
}