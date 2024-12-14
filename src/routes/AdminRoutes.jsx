import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@routes/ProtectedRoute";
import UsersPage from "@pages/Admin/UsersPage";
import UserDetail from "@pages/Admin/UserDetail";

const AdminRoutes = () => {
  return (
    <ProtectedRoute requiredRole={["admin", "superadmin"]}>
      <Routes>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/user/:id" element={<UserDetail />} />
      </Routes>
    </ProtectedRoute>
  );
};

export default AdminRoutes;
