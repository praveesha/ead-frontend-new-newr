export interface User {
  id: number;
  fullName?: string;
  email?: string;
   role?: string | { name: string }; // ✅ Support both formats
  enabled?: boolean;
}

export interface Appointment {
  id: number;
  date: string;
  time: string;
  vehicleType: string;
  vehicleNumber: string;
  service: string; // Changed from serviceType
  serviceType: string;
  instructions?: string;
  
  // Direct fields (for guest appointments)
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  
  // ✅ Nested customer object (for registered users)
  customer?: {
    id: number;
    fullName?: string;
    email?: string;
  };
  
  customerId?: number;
  employeeId?: number;
  employeeName?: string;
  
  // ✅ Nested employee object
  employee?: {
    id: number;
    fullName?: string;
    email?: string;
  };
  
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GroupedAppointments {
  customerId?: number;
  customerName: string;
  customerEmail: string;
  totalCount: number;
  appointments: Appointment[];
}

export type AppointmentStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED';