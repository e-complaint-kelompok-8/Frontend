import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const userToken = localStorage.getItem("token"); 
  const userRole = localStorage.getItem("role"); // Ambil role dari localStorage/session
  return userRole === role ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
