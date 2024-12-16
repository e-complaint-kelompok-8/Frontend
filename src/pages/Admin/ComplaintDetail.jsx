// pages/ComplaintDetail.js
import React from "react";
import Sidebar from "@components/Admin/Sidebar";
import Header from "@components/Admin/Header";
import BottomNavigation from "@components/Admin/BottomNavigation";
import ComplaintForm from "@components/Admin/Complaint/ComplaintForm";

export default function ComplaintDetail() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar className="hidden lg:block w-64 fixed h-full" />
      <div className="flex-1 md:ml-64">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
            <ComplaintForm />
          </div>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}
