// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedTypes = [] }) {
  // prefer sessionStorage then localStorage
  const raw = sessionStorage.getItem("agri_user") || localStorage.getItem("agri_user");
  if (!raw) return <Navigate to="/login" replace />;

  let user;
  try {
    user = JSON.parse(raw);
  } catch {
    return <Navigate to="/login" replace />;
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(user.type)) {
    // logged in but not allowed for this route
    return <Navigate to="/login" replace />;
  }

  return children;
}
