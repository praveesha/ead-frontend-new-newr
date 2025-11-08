// Chat System Types based on backend documentation

export interface User {
  id: number;
  fullName: string;
  email: string;
  enabled: boolean;
  role: {
    id: number;
    name: 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER';
  };
}

export interface Chat {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  createdAt: string; // ISO datetime
  lastMessageAt: string; // ISO datetime
  lastMessageContent: string | null;
  unreadCount: number;
  // ✅ Add computed fields
  otherPersonId?: number;
  otherPersonName?: string;
  otherPersonEmail?: string;
}

export interface Message {
  id: number;
  chatId: number;
  senderId: number;
  sender?: {
    id: number;
    fullName: string;
    email: string;
    role: string;
  };
  content: string;
  type: 'TEXT' | 'CUSTOM_QUESTION';
  createdAt: string;
  updatedAt?: string;
  isEdited: boolean;
  isDeleted?: boolean;
  customQuestionId?: number;
}

export interface CustomQuestion {
  id: number;
  question: string;
  category: 'SERVICE_STATUS' | 'PICKUP_READY' | 'FEEDBACK' | 'GENERAL';
  isActive: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ErrorResponse {
  message: string;
  error?: string;
  status?: number;
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: 'MESSAGE_SENT' | 'MESSAGE_EDITED' | 'MESSAGE_DELETED';
  payload: Message;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ChatState extends LoadingState {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  customQuestions: CustomQuestion[];
  isConnected: boolean;
}