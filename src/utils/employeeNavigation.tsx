import type { Navigation } from '@toolpad/core/AppProvider';

import DashboardIcon from '@mui/icons-material/Dashboard';
// Removed unused imports: InventoryIcon, ShoppingCartIcon, AssessmentIcon
import ChatIcon from '@mui/icons-material/Chat';

export const employeeNavigation: Navigation = [
  {
    segment: 'employee/dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'employee/messages',
    title: 'Messages',
    icon: <ChatIcon />,
  },
];