import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmartCampusHome from "./features/home/pages/SmartCampusHome";
import AuthCallback from "./features/auth/pages/AuthCallback";
import UserDashboard from "./features/user-dashboard/UserDashboard";
import AdminDashboard from "./features/admin-dashboard/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SmartCampusHome />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
