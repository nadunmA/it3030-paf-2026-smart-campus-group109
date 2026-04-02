import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmartCampusHome from "../src/features/home/pages/SmartCampusHome";
import "./App.css";
import AuthCallback from "../src/features/auth/pages/AuthCallback";
import CreateBookingPage from "../src/features/bookings/pages/CreateBookingPage";
import MyBookingsPage from "../src/features/bookings/pages/MyBookingsPage";
import AdminBookingApprovalPage from "../src/features/bookings/pages/AdminBookingApprovalPage";
import { RequireAuth, RequireRole } from "../src/features/auth/components/RouteGuards";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SmartCampusHome />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
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
      </Routes>
    </BrowserRouter>
  );
}
