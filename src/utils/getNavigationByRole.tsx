import type { Navigation } from '@toolpad/core/AppProvider';

import { adminNavigation } from './adminNavigation';
import { employeeNavigation } from './employeeNavigation';
import { superAdminNavigation } from './superAdminNavigation';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER';

export const getNavigationByRole = (role: string): Navigation => {
  const normalizedRole = role.toUpperCase() as UserRole;
  
  switch (normalizedRole) {
    case 'SUPER_ADMIN':
      return superAdminNavigation;
    case 'ADMIN':
      return adminNavigation;
    case 'EMPLOYEE':
      return employeeNavigation; 
    case 'CUSTOMER':
      return []; 
    default:
      return [];
  }
};

export const getDashboardRouteByRole = (role: string): string => {
  const normalizedRole = role.toUpperCase() as UserRole;
  
  switch (normalizedRole) {
    case 'SUPER_ADMIN':
      return '/superadmin/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    case 'EMPLOYEE':
      return '/employee/dashboard';
    case 'CUSTOMER':
      return '/';
    default:
      return '/';
  }
};