import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@routes/ProtectedRoute";
import AdminDashboard from "@pages/Admin/AdminDashboard";

const AdminRoutes = () => {
  return (
    <ProtectedRoute role="admin">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
      </Routes>
    </ProtectedRoute>
  );
};

export default AdminRoutes;
