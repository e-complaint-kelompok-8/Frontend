import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
// import UserDashboard from "../components/User/UserDashboard";
// import UserProfile from "../components/User/UserProfile";
import LandingPage from "@pages/User/LandingPage";

const UserRoutes = () => {
  return (
    <ProtectedRoute >
      <Routes>
        <Route path="/dashboard" element={<LandingPage />} />
      </Routes>
    </ProtectedRoute>
  );
};

export default UserRoutes;
