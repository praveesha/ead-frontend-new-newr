import type { Navigation } from "@toolpad/core/AppProvider";

import DashboardIcon from "@mui/icons-material/Dashboard";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BuildIcon from "@mui/icons-material/Build";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import PendingIcon from "@mui/icons-material/Pending";
import ReceiptIcon from "@mui/icons-material/Receipt";

// import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
// import VerifiedIcon from "@mui/icons-material/Verified";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export const adminNavigation: Navigation = [
  {
    segment: "admin/dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    title: "Appointments",
    icon: <EventAvailableIcon />,
    children: [
      {
        segment: "admin/appointments/pending",
        title: "Pending",
        icon: <PendingIcon />,
      },
      // {
      //   segment: "admin/appointments/confirmed",
      //   title: "Confirmed",
      //   icon: <VerifiedIcon />,
      // },
      {
        segment: "admin/appointments/approve",
        title: "Approved",
        icon: <ThumbUpIcon />,
      },
      {
        segment: "admin/appointments/in-progress",
        title: "In Progress",
        icon: <PlayArrowIcon />,
      },
      // {
      //   segment: "admin/appointments/ongoing",
      //   title: "Ongoing",
      //   icon: <HourglassEmptyIcon />,
      // },
      {
        segment: "admin/appointments/completed",
        title: "Completed",
        icon: <CheckCircleIcon />,
      },
      {
        segment: "admin/appointments/reject",
        title: "Rejected",
        icon: <CancelIcon />,
      },
    ],
  },
  {
    segment: "admin/task-allocation",
    title: "Task Allocation",
    icon: <BuildIcon />,
  },
  {
    title: "User Management",
    icon: <PeopleIcon />,
    children: [
      {
        segment: "admin/employees",
        title: "Employees",
        icon: <BuildIcon />,
      },
      {
        segment: "admin/customers",
        title: "Customers",
        icon: <PeopleIcon />,
      },
    ],
  },
  {
    segment: "admin/invoices",
    title: "Invoices",
    icon: <ReceiptIcon />,
  },
];
