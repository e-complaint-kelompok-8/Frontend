import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@routes/ProtectedRoute";
import Complaints from "@pages/Admin/Complaints";
import ComplaintDetail from "@pages/Admin/ComplaintDetail";

const AdminRoutes = () => {
  return (
    <ProtectedRoute requiredRole={["admin", "superadmin"]}>
      <Routes>
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/complaint/:id" element={<ComplaintDetail />} />
      </Routes>
    </ProtectedRoute>
  );
};

export default AdminRoutes;
