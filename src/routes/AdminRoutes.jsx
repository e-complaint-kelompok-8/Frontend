import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@routes/ProtectedRoute";
import AdminDashboard from "@pages/Admin/AdminDashboard";

const AdminRoutes = () => {
  return (
    <ProtectedRoute requiredRole={["admin", "superadmin"]}>
      <Routes>
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </ProtectedRoute>
  );
};

export default AdminRoutes;
