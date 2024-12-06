import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@routes/ProtectedRoute";
import AdminDashboard from "@pages/Admin/AdminDashboard";

const SuperAdminRoutes = () => {
  return (
    <ProtectedRoute requiredRole={["superadmin"]}>
      <Routes>
        {/* <Route path="/dashboard" element={<AdminDashboard />} /> */}
      </Routes>
    </ProtectedRoute>
  );
};

export default SuperAdminRoutes;
