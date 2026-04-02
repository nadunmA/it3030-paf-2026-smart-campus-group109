import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmartCampusHome from "../src/features/home/pages/SmartCampusHome";
import "./App.css";
import AuthCallback from "../src/features/auth/pages/AuthCallback";
import CreateBookingPage from "../src/features/bookings/pages/CreateBookingPage";
import MyBookingsPage from "../src/features/bookings/pages/MyBookingsPage";
import AdminBookingApprovalPage from "../src/features/bookings/pages/AdminBookingApprovalPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SmartCampusHome />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/bookings/create" element={<CreateBookingPage />} />
        <Route path="/bookings/me" element={<MyBookingsPage />} />
        <Route path="/bookings/admin" element={<AdminBookingApprovalPage />} />
      </Routes>
    </BrowserRouter>
  );
}
