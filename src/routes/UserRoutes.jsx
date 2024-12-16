import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import HeaderUser from "@components/Shared/HeaderUser";
import Beranda from "@pages/User/Beranda";
import StatusComplaint from "@pages/User/StatusComplaint";
import DetailComplaint from "@pages/User/DetailComplaint";
import AllNews from "@components/User/Berita/AllNews";
import DetailNews from "@components/User/Berita/DetailNews";
import Profile from "@components/User/Profile/Profile";

const UserRoutes = () => {
  return (
    <>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <HeaderUser />
          <Routes>
            <Route path="/dashboard" element={<Beranda />} />
            <Route path="/status-pengaduan" element={<StatusComplaint />} />
            <Route
              path="/status-pengaduan/detail/:id"
              element={<DetailComplaint />}
            />
            <Route path="/berita" element={<AllNews />} />
            <Route path="/berita/detail/:id" element={<DetailNews />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </ProtectedRoute>
      <ProtectedRoute></ProtectedRoute>
    </>
  );
};

export default UserRoutes;
