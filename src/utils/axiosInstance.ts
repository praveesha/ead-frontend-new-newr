import axios from "axios";

const RAW_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;
const normalizedBase =
  RAW_BASE && RAW_BASE !== "undefined" ? RAW_BASE.replace(/\/$/, "") : undefined;

const axiosInstance = axios.create({
  baseURL: normalizedBase || "https://praveesha.dev/api",
  timeout: 150000, // Increased timeout for backend API calls
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const hasToken = error.config?.headers?.Authorization;

      if (hasToken) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
