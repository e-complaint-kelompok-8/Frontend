import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@routes/ProtectedRoute";

const SuperAdminRoutes = () => {
  return (
    <ProtectedRoute requiredRole={["superadmin"]}>
      <Routes>
      </Routes>
    </ProtectedRoute>
  );
};

export default SuperAdminRoutes;
