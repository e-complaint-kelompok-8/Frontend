import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useAuthStore from "@stores/useAuthStore";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { token } = useAuthStore();

  let role = null;

  // Decode token if available
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      role = decodedToken.role; // Extract role from token
    } catch (error) {
      console.error("Invalid token:", error);
      return <Navigate to="/login" />;
    }
  }

  // Validate token and role (if requiredRole is provided)
  if (!token || (requiredRole && !requiredRole.includes(role))) {
    return <Navigate to="/login" />;
  }

  // Render children if validation passes
  return children;
};

export default ProtectedRoute;
