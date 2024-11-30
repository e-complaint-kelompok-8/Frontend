import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../components/Admin/AdminDashboard";

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
