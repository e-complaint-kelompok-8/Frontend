import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const UserRoutes = () => {
  return (
    <ProtectedRoute>
      <Routes></Routes>
    </ProtectedRoute>
  );
};

export default UserRoutes;
