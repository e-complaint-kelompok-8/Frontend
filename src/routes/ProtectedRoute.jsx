import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "@stores/useAuthStore"; 

const ProtectedRoute = ({ children, role }) => {
  // Use Zustand store to get the token and role instead of localStorage
  const { token, role: userRole } = useAuthStore();

  // Check if the user's role matches the required role and a token exists
  return token && userRole === role ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
