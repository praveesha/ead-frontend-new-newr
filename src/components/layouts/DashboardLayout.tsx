import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout as ToolpadDashboardLayout } from '@toolpad/core/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { getNavigationByRole } from '../../utils/getNavigationByRole';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import theme from '../../../theme';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    return null;
  }

  const navigation = getNavigationByRole(user.role);

  const router = {
    pathname: location.pathname,
    searchParams: new URLSearchParams(location.search),
    navigate: (path: string | URL) => navigate(path.toString()),
  };

  const authentication = {
    signIn: () => navigate('/login'),
    signOut: () => logout(),
  };

  return (
    <AppProvider
      navigation={navigation}
      router={router}
      theme={theme}
      branding={{
        title: 'Auto Care Pro',
        logo: <></>, 
      }}
      authentication={authentication}
      session={{
        user: {
          name: user.fullName,
          email: user.email,
          image: '',
        },
      }}
    >
      <ToolpadDashboardLayout>
        {children || <Outlet />}
      </ToolpadDashboardLayout>
    </AppProvider>
  );
}