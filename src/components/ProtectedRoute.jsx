// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/*
  ProtectedRoute usage:
  <ProtectedRoute allowedTypes={['farmer']}>
    <FarmerDashboard />
  </ProtectedRoute>

  If allowedTypes is omitted, any logged-in user is allowed.
*/

export default function ProtectedRoute({ children, allowedTypes }) {
  const s = localStorage.getItem("agri_user");
  if (!s) return <Navigate to="/login" replace />;

  try {
    const user = JSON.parse(s);
    if (!allowedTypes || allowedTypes.length === 0) return children;
    if (allowedTypes.includes(user.type)) return children;
    // user logged in but not permitted for this route
    // redirect to their dashboard
    if (user.type === "farmer") return <Navigate to="/farmer-dashboard" replace />;
    if (user.type === "expert") return <Navigate to="/expert-dashboard" replace />;
    return <Navigate to="/" replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }
}
