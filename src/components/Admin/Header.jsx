import React, { useState, useRef, useEffect } from "react";
import { Bell, LogOut, Search, Settings, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAdminStore from "@stores/useAdminStore";
import Swal from "sweetalert2";

const HeaderSkeleton = () => (
  <header className="bg-white shadow-sm sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* Search Section Skeleton */}

        <div className="flex items-center md:flex-1 w-56">
          {/* <div className="flex items-center w-full max-w-md relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 bg-gray-300 rounded-full z-10 animate-pulse"></div>
            <div className="w-full">
              <div className="relative">
                <div className="w-full">
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="absolute left-10 top-1/2 transform -translate-y-1/2">
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          */}
        </div>

        {/* Notification and Profile Section Skeleton */}
        <div className="flex items-center space-x-4">
          <div className="w-7 h-7 bg-gray-300 rounded-full animate-pulse"></div>

          <div className="flex items-center space-x-2">
            {/* <div className="w-7 h-7 bg-gray-300 rounded-full animate-pulse"></div> */}
            <div className="hidden sm:block">
              <div className="h-4 w-24 bg-gray-200 mb-1 rounded animate-pulse"></div>
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-5 w-5 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </header>
);

const Header = () => {
  const navigate = useNavigate();
  const { adminProfile, fetchAdminProfile, clearAuth } = useAdminStore();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleProfileClick = () => {
    navigate("/admin/profile/");
    setShowProfileDropdown(false);
  };
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Anda akan keluar dari aplikasi",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Keluar!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        clearAuth();
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const getDisplayName = () => {
    if (!adminProfile.email) return "Admin";
    return adminProfile.email.split("@")[0];
  };

  const getInitial = () => {
    if (!adminProfile.email) return "A";
    return adminProfile.email.charAt(0).toUpperCase();
  };

  const getRole = () => {
    if (!adminProfile.role) return "";
    return (
      adminProfile.role.charAt(0).toUpperCase() + adminProfile.role.slice(1)
    );
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div></div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                  {adminProfile.photo ? (
                    <img
                      src={adminProfile.photo}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                      {getInitial()}
                    </div>
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">
                    Halo! {getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500">{getRole()}</p>
                </div>
                <ChevronRight
                  size={20}
                  className={`transition-transform duration-300 ${
                    showProfileDropdown ? "rotate-90" : ""
                  }`}
                />
              </div>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Settings className="h-5 w-5 text-gray-500" />
                      <span>Profil</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut className="h-5 w-5 text-red-600" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
