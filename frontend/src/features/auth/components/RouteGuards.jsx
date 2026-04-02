import React from "react";
import { Navigate } from "react-router-dom";

export function RequireAuth({ children }) {
  const token = sessionStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function RequireRole({ children, allowedRoles = [] }) {
  const token = sessionStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const raw = sessionStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;
    const role = user?.role || "USER";

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return <Navigate to="/bookings/me" replace />;
    }
  } catch {
    return <Navigate to="/" replace />;
  }

  return children;
}
