import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@routes/ProtectedRoute";

import Profile from "@pages/Admin/Profile";

import Dashboard from "@pages/Admin/Dashboard";


const AdminRoutes = () => {
  return (
    <ProtectedRoute requiredRole={["admin", "superadmin"]}>
      <Routes>

        <Route path="/profile/" element={<Profile />} />

        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </ProtectedRoute>
  );
};

export default AdminRoutes;
