import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@routes/ProtectedRoute";
import PublicServices from "@pages/Admin/PublicServices";
import PublicServicesDetail from "@pages/Admin/PublicServicesDetail";

const AdminRoutes = () => {
  return (
    <ProtectedRoute requiredRole={["admin", "superadmin"]}>
      <Routes>
        <Route path="/public-services" element={<PublicServices />} />
        <Route path="/news/:id" element={<PublicServicesDetail />} />
      </Routes>
    </ProtectedRoute>
  );
};

export default AdminRoutes;
