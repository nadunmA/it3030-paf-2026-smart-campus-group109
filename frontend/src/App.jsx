import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmartCampusHome from "./features/home/pages/SmartCampusHome";
import AuthCallback from "./features/auth/pages/AuthCallback";
import UserDashboard from "./features/user-dashboard/UserDashboard";
import AdminDashboard from "./features/admin-dashboard/AdminDashboard";
import TechnicianDashboard from "./features/technician-dashboard/TechnicianDashboard";
import UserNotifications from "./features/notification/NotificationsPage";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SmartCampusHome />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

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
