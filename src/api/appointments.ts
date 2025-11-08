import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

export interface ApiAppointment {
  id: number;
  date: string;
  time: string | {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  vehicleType: string;
  vehicleNumber: string;
  service: string;
  instructions: string;
  status: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  customer: {
    id: number;
    fullName: string;
    email: string;
  };
  employee?: {
    id: number;
    fullName: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt?: string;
}

export const appointmentApi = {
  getMyAppointments: async (): Promise<ApiAppointment[]> => {
    try {
      const response = await axiosInstance.get(API_PATHS.APPOINTMENTS.MY_APPOINTMENTS);
      return response.data;
    } catch (error) {
      console.error('Error fetching my appointments:', error);
      throw new Error('Failed to fetch appointments');
    }
  },

  getAppointmentById: async (id: number): Promise<ApiAppointment> => {
    try {
      const response = await axiosInstance.get(API_PATHS.APPOINTMENTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw new Error('Failed to fetch appointment');
    }
  },

  updateAppointment: async (id: number, data: Partial<ApiAppointment>): Promise<ApiAppointment> => {
    try {
      const response = await axiosInstance.put(API_PATHS.APPOINTMENTS.UPDATE(id), data);
      return response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw new Error('Failed to update appointment');
    }
  },

  cancelAppointment: async (id: number): Promise<void> => {
    try {
      await axiosInstance.patch(API_PATHS.APPOINTMENTS.CANCEL(id));
    } catch (error) {
      console.error('Error canceling appointment:', error);
      throw new Error('Failed to cancel appointment');
    }
  },
};