import React from "react";
import Sidebar from "@components/Admin/Sidebar";
import Header from "@components/Admin/Header";
import BottomNavigation from "@components/Admin/BottomNavigation";
import DashboardContent from "@components/Admin/DashboardContent";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100 pb-16 md:pb-16 lg:pb-0">
      <Sidebar className="hidden lg:block w-64 fixed h-full" />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />
        <DashboardContent />
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Dashboard;
