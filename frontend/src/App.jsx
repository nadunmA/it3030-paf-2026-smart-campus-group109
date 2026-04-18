import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmartCampusHome from "./features/home/pages/SmartCampusHome";
import "./App.css";
import AuthCallback from "./features/auth/pages/AuthCallback";
import UserDashboard from "./features/dashboard/user-dashboard/UserDashboard";
import AdminDashboard from "./features/dashboard/admin-dashboard/AdminDashboard";
import TechnicianDashboard from "./features/dashboard/technician-dashboard/TechnicianDashboard";
import UserNotifications from "./features/notification/pages/NotificationsPage";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import CreateBookingPage from "./features/bookings/pages/CreateBookingPage";
import MyBookingsPage from "./features/bookings/pages/MyBookingsPage";
import AdminBookingApprovalPage from "./features/bookings/pages/AdminBookingApprovalPage";
import {
  RequireAuth,
  RequireRole,
} from "./features/auth/components/RouteGuards";
import ResourceListPage from "./features/resources/ResourceListPage";
import ResourceDetailPage from "./features/resources/ResourceDetailPage";
import QRScannerPage from "./features/resources/QRScannerPage";
import PublicQRDetailPage from "./features/resources/PublicQRDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SmartCampusHome />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* Public QR detail page - no authentication required */}
        <Route path="/qr/:id" element={<PublicQRDetailPage />} />

        <Route
          path="/bookings/create"
          element={
            <RequireAuth>
              <CreateBookingPage />
            </RequireAuth>
          }
        />
        <Route
          path="/bookings/me"
          element={
            <RequireAuth>
              <MyBookingsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/bookings/admin"
          element={
            <RequireRole allowedRoles={["ADMIN"]}>
              <AdminBookingApprovalPage />
            </RequireRole>
          }
        />

        {/* USER only */}
        <Route element={<ProtectedRoute allowRoles={["USER"]} />}>
          <Route path="/dashboard" element={<UserDashboard />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowRoles={["USER", "ADMIN", "TECHNICIAN"]} />
          }
        >
          <Route path="/notifications" element={<UserNotifications />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowRoles={["USER", "ADMIN"]} />
          }
        >
          <Route path="/resources" element={<ResourceListPage />} />
          <Route path="/resources/:id" element={<ResourceDetailPage />} />
          <Route path="/resources/scan/qr" element={<QRScannerPage />} />
        </Route>

        {/* TECHNICIAN only */}
        <Route element={<ProtectedRoute allowRoles={["TECHNICIAN"]} />}>
          <Route
            path="/technician/dashboard"
            element={<TechnicianDashboard />}
          />
        </Route>

        {/* ADMIN only */}
        <Route element={<ProtectedRoute allowRoles={["ADMIN"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
