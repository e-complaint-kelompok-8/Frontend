// pages/Complaints.js
import React from "react";
import Sidebar from "@components/Admin/Sidebar";
import Header from "@components/Admin/Header";
import BottomNavigation from "@components/Admin/BottomNavigation";
import ComplaintList from "@components/Admin/Complaint/ComplaintList";

export default function Complaints() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar className="hidden lg:block w-64 fixed h-full" />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
            <ComplaintList />
          </div>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}
