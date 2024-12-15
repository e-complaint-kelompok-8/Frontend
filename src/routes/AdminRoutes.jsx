import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@routes/ProtectedRoute";

import PublicServices from "@pages/Admin/PublicServices";
import PublicServicesDetail from "@pages/Admin/PublicServicesDetail";

import Complaints from "@pages/Admin/Complaints";
import ComplaintDetail from "@pages/Admin/ComplaintDetail";

import Profile from "@pages/Admin/Profile";

import Dashboard from "@pages/Admin/Dashboard";



const AdminRoutes = () => {
  return (
    <ProtectedRoute requiredRole={["admin", "superadmin"]}>
      <Routes>

        <Route path="/public-services" element={<PublicServices />} />
        <Route path="/news/:id" element={<PublicServicesDetail />} />


        <Route path="/complaints" element={<Complaints />} />
        <Route path="/complaint/:id" element={<ComplaintDetail />} />


        <Route path="/profile/" element={<Profile />} />

        <Route path="/dashboard" element={<Dashboard />} />


      </Routes>
    </ProtectedRoute>
  );
};

export default AdminRoutes;
