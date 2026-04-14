import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmartCampusHome from "./features/home/pages/SmartCampusHome";
import AuthCallback from "./features/auth/pages/AuthCallback";
import UserDashboard from "./features/user-dashboard/UserDashboard";
import AdminDashboard from "./features/admin-dashboard/AdminDashboard";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import TicketFormPage from "./features/tickets/pages/TicketFormPage";
import TicketDetailPage from "./features/tickets/pages/TicketDetailPage";
import RegisterPage from "./features/auth/pages/RegisterPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SmartCampusHome />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* USER only */}
        <Route element={<ProtectedRoute allowRoles={["USER"]} />}>
          <Route path="/dashboard" element={<UserDashboard />} />
        </Route>

        {/* ADMIN only */}
        <Route element={<ProtectedRoute allowRoles={["ADMIN"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Any authenticated user (USER, ADMIN, TECHNICIAN) */}
        <Route element={<ProtectedRoute allowRoles={[]} />}>
          <Route path="/tickets/new" element={<TicketFormPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
          <Route path="/admin/tickets/:id" element={<TicketDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
