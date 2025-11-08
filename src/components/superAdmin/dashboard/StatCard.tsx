import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card elevation={6} sx={{ p: 2, textAlign: "center", borderLeft: `6px solid ${color}` }}>
      <Box sx={{ mb: 1 }}>{icon}</Box>
      <Typography variant="h5" fontWeight={700} color={color}>{value}</Typography>
      <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
    </Card>
  );
}