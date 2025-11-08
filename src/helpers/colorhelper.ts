import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import AccessTime from "@mui/icons-material/AccessTime";
import Receipt from "@mui/icons-material/Receipt";
import PlayArrow from "@mui/icons-material/PlayArrow";
import HourglassEmpty from "@mui/icons-material/HourglassEmpty";

type StatusColorType = 'success' | 'warning' | 'error' | 'info' | 'default';

export const getStatusColor = (status: string | undefined | null): StatusColorType => {
  const normalizedStatus = status?.toLowerCase();
  switch (normalizedStatus) {
    case 'read':
      return 'success';
    case 'unread':
      return 'warning';
    case 'generated':
      return 'info';
    case 'sent':
      return 'success';
    case 'approved':
      return 'success';
    case 'rejected':
      return 'error';
    case 'pending':
      return 'warning';
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'info';
    case 'cancelled':
      return 'error';
    case 'total':
      return 'info';
    default:
      return 'default';
  }
};

export const getStatusIcon = (status: string | undefined | null): typeof AccessTime => {
  const normalizedStatus = status?.toLowerCase();
  switch (normalizedStatus) {
    case "unread":
      return AccessTime;
    case "read":
      return CheckCircle;
    case 'generated':
      return Receipt;
    case 'sent':
      return CheckCircle;
    case "approved":
      return CheckCircle;
    case "rejected":
      return Cancel;
    case "pending":
      return AccessTime;
    case "completed":
      return CheckCircle;
    case "in_progress":
      return PlayArrow;
    case "cancelled":
      return Cancel;
    default:
      return HourglassEmpty;
  }
};

export const getWorkModeColor = (mode: string | undefined | null): StatusColorType => {
  const normalizedMode = mode?.toLowerCase();
  switch (normalizedMode) {
    case 'online':
      return 'info';
    case 'on-site':
      return 'success';
    case 'hybrid':
      return 'warning';
    default:
      return 'default';
  }
};

export const getLeaveTypeColor = (leaveType: string | undefined | null): string => {
  switch (leaveType) {
    case "Annual":
      return "#D81B60";
    case "Casual Leave":
      return "#2563EB";
    case "Sick":
      return "#DC2626";
    case "Maternity":
      return "#059669";
    case "Vacation":
      return "#7C3AED";
    default:
      return "#6B7280";
  }
};
