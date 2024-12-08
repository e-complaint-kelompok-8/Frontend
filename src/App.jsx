import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminRoutes from "@routes/AdminRoutes";
import SuperAdminRoutes from "@routes/SuperAdminRoutes";

import LoginPage from "@pages/Auth/User/LoginPage";
import RegisterPage from "@pages/Auth/User/RegisterPage";
import OTPVerificationPage from "@pages/Auth/User/OTPVerificationPage";

import LoginPageAdmin from "@pages/Auth/Admin/LoginPageAdmin";
import RegisterPageAdmin from "@pages/Auth/Admin/RegisterPageAdmin";


function App() {
  return (
    <Router>
      <Routes>

        {/* Users */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<OTPVerificationPage />} />

        {/* Admins */}
        <Route path="/admin-login" element={<LoginPageAdmin />} />
        <Route path="/admin-register" element={<RegisterPageAdmin />} />

        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/super-admin/*" element={<SuperAdminRoutes />} />

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
