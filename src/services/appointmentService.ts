import axios from 'axios';
import { API_PATHS } from '../utils/apiPaths';
import type { Appointment, User } from '../types/appointment';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

// ✅ Helper to normalize appointment data from backend
const normalizeAppointment = (appointment: any): Appointment => {
  return {
    ...appointment,
    // ✅ Normalize service field
    service: appointment.service || appointment.serviceType,
    serviceType: appointment.service || appointment.serviceType,
    
    // ✅ Normalize customer data (handle both nested and flat structures)
    customerId: appointment.customer?.id || appointment.customerId,
    customerName: appointment.customer?.fullName || appointment.customerName,
    customerEmail: appointment.customer?.email || appointment.customerEmail,
    customerPhone: appointment.customerPhone, // This stays as is
    
    // ✅ Normalize employee data
    employeeId: appointment.employee?.id || appointment.employeeId,
    employeeName: appointment.employee?.fullName || appointment.employeeName,
    employeeEmail: appointment.employee?.email || appointment.employeeEmail,
  };
};

export const appointmentService = {
  // Get appointments by status
  async getByStatus(status: string): Promise<Appointment[]> {
    try {
      const response = await axios.get(
        API_PATHS.APPOINTMENTS.BY_STATUS(status),
        getAuthHeaders()
      );
      
      // ✅ Transform all appointments
      return response.data.map(normalizeAppointment);
    } catch (error) {
      console.error('Error fetching appointments by status:', error);
      throw error;
    }
  },

  // Get single appointment details
  async getById(id: number): Promise<Appointment> {
    try {
      const response = await axios.get(
        API_PATHS.APPOINTMENTS.GET_BY_ID(id),
        getAuthHeaders()
      );
      
      // ✅ Transform single appointment
      return normalizeAppointment(response.data);
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      throw error;
    }
  },

  // Allocate appointment to employee
  async allocateToEmployee(
    appointmentId: number,
    employeeId: number
  ): Promise<Appointment> {
    try {
      const response = await axios.put(
        API_PATHS.APPOINTMENTS.ALLOCATE(appointmentId),
        { employeeId },
        getAuthHeaders()
      );
      
      // ✅ Transform allocated appointment
      return normalizeAppointment(response.data);
    } catch (error) {
      console.error('Error allocating appointment:', error);
      throw error;
    }
  },

  // Get available employees
  async getAvailableEmployees(): Promise<User[]> {
    try {
      const response = await axios.get(
        API_PATHS.USER.EMPLOYEES,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },
};