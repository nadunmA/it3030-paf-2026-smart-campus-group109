import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowRoles = [] }) {
  const token = sessionStorage.getItem("token");
  const userRaw = sessionStorage.getItem("user");

  if (!token || !userRaw) return <Navigate to="/" replace />;

  let user;
  try {
    user = JSON.parse(userRaw);
  } catch {
    return <Navigate to="/" replace />;
  }

  const role = (user?.role || "").toUpperCase();

  // if no role restriction, just authenticated users allowed
  if (allowRoles.length === 0) return <Outlet />;

  if (!allowRoles.includes(role)) {
    // logged in but wrong role -> send to correct dashboard
    if (role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
    if (role === "TECHNICIAN") {
      return <Navigate to="/technician/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
