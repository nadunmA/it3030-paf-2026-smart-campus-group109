import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowRoles = [] }) {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowRoles.length > 0) {
    try {
      const raw = sessionStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : null;
      const role = (user?.role || "USER").toUpperCase();
      const allowed = allowRoles.map((r) => r.toUpperCase());
      if (!allowed.includes(role)) {
        return <Navigate to="/" replace />;
      }
    } catch {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
