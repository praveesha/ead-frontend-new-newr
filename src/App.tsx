import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import AuthContainer from "./components/auth/AuthContainer";

import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import AboutSection from "./components/landing/AboutSection";
import WhyChooseUs from "./components/landing/WhyChooseUs";
import LeadershipTeam from "./components/landing/LeadershipTeam";
import Certificate from "./components/landing/Certificate";
import Footer from "./components/landing/Footer";
import GetStarted from "./components/landing/GetStarted";

import ProtectedRoute from "./components/routes/ProtectedRoute";
import DashboardLayout from "./components/layouts/DashboardLayout";

import AdminDashboard from "./components/admin/dashboard/AdminDashboard";
import TaskAllocationPage from "./components/admin/adminTaskAllocation/TaskAllocationPage";
import Invoices from "./components/admin/invoices/Invoices";
import Employees from "./components/admin/employees/Employees";
import Customers from "./components/admin/customers/Customers";
import AppointmentsByStatus from "./components/admin/appointments/AppointmentsByStatus";

import Users from "./components/superAdmin/users/Users";

import BookingAppointment from "./components/customer/BookingAppointment";
import { MyAppoiment } from "./components/customer/MyAppoiment";

import Employee from "./components/employee/Employee";

import ChatInterface from "./components/chat/ChatInterface";
import EmployeeChatInterface from "./components/chat/EmployeeChatInterface";
import { Chatbot } from "./components/chat/Chatbot";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Landing page */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Hero />
                  <AboutSection />
                  <WhyChooseUs />
                  <LeadershipTeam />
                  <Certificate />
                  <GetStarted />
                  <Footer />
                </>
              }
            />

            {/* Auth */}
            <Route path="/login" element={<AuthContainer />} />
            <Route path="/signup" element={<AuthContainer />} />


            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="task-allocation" element={<TaskAllocationPage />} />
              <Route path="appointments/:status" element={<AppointmentsByStatus />} />
              <Route path="employees" element={<Employees />} />
              <Route path="customers" element={<Customers />} />
              <Route path="invoices" element={<Invoices />} />
            </Route>

            {/* Super Admin */}
            <Route
              path="/superadmin"
              element={
                <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="appointments/:status" element={<AppointmentsByStatus />} />
            </Route>

            {/* Employee routes */}
            <Route
              path="/employee"
              element={
                <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Employee />} />
              <Route
                path="messages"
                element={
                  <ChatProvider>
                    <EmployeeChatInterface />
                  </ChatProvider>
                }
              />
            </Route>

            {/* Customer routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                  <Outlet />
                </ProtectedRoute>
              }
            >
              <Route index element={<BookingAppointment />} />
              <Route path="appointments" element={<MyAppoiment />} />
              <Route
                path="messages"
                element={
                  <ChatProvider>
                    <ChatInterface />
                  </ChatProvider>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>

          <Chatbot />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;