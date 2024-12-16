// pages/PublicServices.js
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "@components/Admin/Sidebar";
import Header from "@components/Admin/Header";
import BottomNavigation from "@components/Admin/BottomNavigation";
import NewsList from "@components/Admin/News/NewsList";

export default function PublicServices() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-gray-100 pb-16 md:pb-16 lg:pb-0">
      <Sidebar className="hidden lg:block w-64 fixed h-full" />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
            <NewsList />
          </div>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}
