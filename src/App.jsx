import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserRoutes from "@routes/UserRoutes";

import LoginPage from "@pages/Auth/User/LoginPage";
import RegisterPage from "@pages/Auth/User/RegisterPage";
import OTPVerificationPage from "@pages/Auth/User/OTPVerificationPage";

import LoginPageAdmin from "@pages/Auth/Admin/LoginPageAdmin";
import RegisterPageAdmin from "@pages/Auth/Admin/RegisterPageAdmin";
import LandingPage from "@pages/User/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Users */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<OTPVerificationPage />} />

        {/* Admins */}
        <Route path="/admin-login" element={<LoginPageAdmin />} />
        <Route path="/admin-register" element={<RegisterPageAdmin />} />

        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
