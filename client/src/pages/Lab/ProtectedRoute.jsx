// src/components/ProtectedRouteLab.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRouteLab = ({ children }) => {
  const token = localStorage.getItem("labToken");

  // Optional: Add token validation logic here (e.g., expiration check)

  if (!token) {
    return <Navigate to="/lab/login" replace />;
  }

  return children;
};

export default ProtectedRouteLab;
