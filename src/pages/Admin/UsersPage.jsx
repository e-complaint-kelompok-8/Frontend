import React from "react";
import Sidebar from "@components/Admin/Sidebar";
import Header from "@components/Admin/Header";
import BottomNavigation from "@components/Admin/BottomNavigation";
import UserList from "@components/Admin/Users/UserList";

const UsersPage = () => {
  return (
    <div className="flex h-screen bg-gray-100 pb-16 md:pb-16 lg:pb-0">
      <Sidebar className="hidden lg:block w-64 fixed h-full" />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
            <UserList />
          </div>
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
};

export default UsersPage;
