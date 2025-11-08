// Read raw env values and guard against the literal string 'undefined' which can appear
// when env vars are not provided in some environments.
const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const RAW_WS_URL = import.meta.env.VITE_WS_URL as string | undefined;

const BASE_URL =
  RAW_BASE_URL && RAW_BASE_URL !== "undefined"
    ? RAW_BASE_URL.replace(/\/$/, "")
    : "";

// SockJS expects an http(s) endpoint (not ws://). Trim any trailing slash to avoid accidental '//' when concatenating.
const WS_URL = RAW_WS_URL && RAW_WS_URL !== "undefined" ? RAW_WS_URL.replace(/\/$/, "") : "";

export const API_PATHS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    SIGNUP: `${BASE_URL}/auth/register`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    REFRESH: `${BASE_URL}/auth/refresh`,
  },
  USER: {
    PROFILE: `${BASE_URL}/user/profile`,
    UPDATE: `${BASE_URL}/user/update`,
    EMPLOYEES: `${BASE_URL}/users/employees`,

    //admin
    CREATE: `${BASE_URL}/super-admin/users`,
    GET_ALL: `${BASE_URL}/super-admin/users`,
  DELETE: (userId: number) => `${BASE_URL}/super-admin/users/${userId}`,

  },
  CHAT: {
    // If VITE_WS_URL is set use it, otherwise fall back to relative endpoint so frontend and backend
    // served from the same origin work without extra env config.
  ENDPOINT: WS_URL ? `${WS_URL}/ws-chat` : "/ws-chat",
    CONVERSATIONS: (userId: number) =>
      `${BASE_URL}/chat/conversations/${userId}`,
    MESSAGES: (chatId: number) => `${BASE_URL}/chat/messages/${chatId}`,
    SEND: `${BASE_URL}/chat/send`,
    EDIT: (messageId: number) => `${BASE_URL}/chat/edit/${messageId}`,
    DELETE: (messageId: number) => `${BASE_URL}/chat/delete/${messageId}`,
    CREATE: `${BASE_URL}/chat/create`,
    CUSTOM_QUESTIONS: `${BASE_URL}/chat/custom-questions`,
  },
  APPOINTMENTS: {
    CREATE: `${BASE_URL}/appointments`,
    MY_APPOINTMENTS: `${BASE_URL}/appointments/my`,
    GET_BY_ID: (id: number) => `${BASE_URL}/appointments/${id}`,
    UPDATE: (id: number) => `${BASE_URL}/appointments/${id}`,
    CANCEL: (id: number) => `${BASE_URL}/appointments/${id}/cancel`,
    DELETE: (id: number) => `${BASE_URL}/appointments/${id}`,
    BY_STATUS: (status: string) => `${BASE_URL}/appointments/status/${status}`,
    TODAY: `${BASE_URL}/appointments/today`,
    DATE_RANGE: `${BASE_URL}/appointments/date-range`,
    ALLOCATE: (id: number) => `${BASE_URL}/appointments/${id}/allocate`,

    GET_EMPLOYEE_APPOINTMENTS: (employeeId: number) => `${BASE_URL}/employee/appointments/${employeeId}`,
    UPDATE_PROGRESS: (id: number) => `${BASE_URL}/employee/appointments/${id}/progress`,
  
  },
  HEALTH: {
    CHECK: `${BASE_URL}/health`,
    DATABASE: `${BASE_URL}/health/db`,
  },
  CHATBOT: {
    ASK: `${BASE_URL}/chatbot/ask`,
    HEALTH: `${BASE_URL}/chatbot/health`,
  },
};
