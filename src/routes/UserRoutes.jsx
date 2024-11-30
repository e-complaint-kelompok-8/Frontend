import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import UserDashboard from "../components/User/UserDashboard";
import UserProfile from "../components/User/UserProfile";

const UserRoutes = () => {
  return (
    <ProtectedRoute role="user">
      <Routes>
        <Route path="/" element={<UserDashboard />} />
      </Routes>
    </ProtectedRoute>
  );
};

export default UserRoutes;
