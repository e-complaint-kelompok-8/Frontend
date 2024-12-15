import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@routes/ProtectedRoute";

import Dashboard from "@pages/Admin/Dashboard";

import Profile from "@pages/Admin/Profile";


const AdminRoutes = () => {
  return (
    <ProtectedRoute requiredRole={["admin", "superadmin"]}>
      <Routes>

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/profile/" element={<Profile />} />

      </Routes>
    </ProtectedRoute>
  );
};

export default AdminRoutes;
