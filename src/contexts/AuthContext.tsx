import type { ReactNode } from 'react';

import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { getDashboardRouteByRole } from "../utils/getNavigationByRole";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { 
        id, 
        fullName, 
        email: userEmail, 
        role, 
        JWT 
      } = response.data;

      const userData: User = {
        id,
        fullName,
        email: userEmail, 
        role,
      };

      setUser(userData);
      setToken(JWT);

      localStorage.setItem("token", JWT);
      localStorage.setItem("user", JSON.stringify(userData));

      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${JWT}`;

      const dashboardRoute = getDashboardRouteByRole(role);
      navigate(dashboardRoute);
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (fullName: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, {
        fullName,
        email,
        password,
      });

      const { 
        id, 
        fullName: userName, 
        email: userEmail, 
        role, 
        JWT 
      } = response.data;

      const userData: User = {
        id,
        fullName: userName, 
        email: userEmail,  
        role,
      };

      setUser(userData);
      setToken(JWT);

      localStorage.setItem("token", JWT);
      localStorage.setItem("user", JSON.stringify(userData));

      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${JWT}`;

      const dashboardRoute = getDashboardRouteByRole(role);
      navigate(dashboardRoute);
    } catch (error: any) {
      console.error("Signup error:", error);
      throw new Error(error.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axiosInstance.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    isAuthenticated: !!token,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};