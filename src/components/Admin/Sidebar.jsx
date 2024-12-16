import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  PieChart,
  MessageSquare,
  Users,
  LogOut,
  Newspaper,
  X,
} from "lucide-react";
import useAuthStore from "@stores/useAuthStore"; // Pastikan Anda mengimpor useAuthStore

const Sidebar = ({ className, onClose, isLoading }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Untuk navigasi setelah logout
  const clearAuth = useAuthStore((state) => state.clearAuth); // Ambil fungsi clearAuth dari store

  const navItems = [
    { icon: PieChart, label: "Dashboard", path: "/admin/dashboard" },
    { icon: MessageSquare, label: "Complaint", path: "/admin/complaints" },
    {
      icon: Newspaper,
      label: "Public Services",
      path: "/admin/public-services",
    },
    { icon: Users, label: "Users", path: "/admin/users" },
  ];

  const isActivePath = (path) => {
    const { pathname } = location;

    // Define active routes with patterns
    const activeRoutes = {
      "/admin/complaints": ["/admin/complaints", "/admin/complaint"],
      "/admin/public-services": ["/admin/public-services", "/admin/news"],
      "/admin/users": ["/admin/users", "/admin/user"],
    };

    // Check if pathname matches any pattern in activeRoutes
    for (const [key, routes] of Object.entries(activeRoutes)) {
      if (routes.some((route) => pathname.startsWith(route))) {
        return path === key;
      }
    }

    // Default check for exact match
    return pathname === path;
  };

  // Skeleton Loading Component
  const SidebarSkeleton = () => (
    <div
      className={`bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 text-white p-4 md:p-6 space-y-6 h-full flex flex-col ${className} transition-colors duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="h-8 bg-white/20 rounded w-1/2 animate-pulse"></div>
        {onClose && (
          <div className="h-8 w-8 bg-white/20 rounded-full animate-pulse"></div>
        )}
      </div>
      <nav className="space-y-4 flex-grow">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 py-2 px-2 rounded-lg bg-white/20 animate-pulse"
          >
            <div className="h-5 w-5 bg-white/30 rounded-full"></div>
            <div className="h-4 w-3/4 bg-white/30 rounded"></div>
          </div>
        ))}
      </nav>
      <div>
        <div className="flex items-center space-x-2 py-2 px-2 rounded-lg bg-white/20 animate-pulse">
          <div className="h-5 w-5 bg-white/30 rounded-full"></div>
          <div className="h-4 w-1/2 bg-white/30 rounded"></div>
        </div>
      </div>
    </div>
  );

  // If loading, return only the skeleton
  if (isLoading) {
    return <SidebarSkeleton />;
  }

  // Logout handler
  const handleLogout = () => {
    clearAuth(); // Clear authentication data
    navigate("/login"); // Redirect to login page (sesuaikan dengan route login Anda)
  };

  // Regular sidebar rendering
  return (
    <div
      className={`bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 text-white p-4 md:p-6 space-y-6 h-full flex flex-col ${className} transition-colors duration-300`}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Laporin</h1>
        {onClose && (
          <button onClick={onClose} className="md:hidden">
            <X size={24} />
          </button>
        )}
      </div>
      <nav className="space-y-4 flex-grow">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={label}
            to={path}
            className={`flex items-center space-x-2 py-2 px-2 rounded-lg transition-colors duration-300 ${
              isActivePath(path)
                ? "bg-white text-indigo-700"
                : "text-white hover:bg-indigo-500/95 hover:text-white"
            }`}
          >
            <Icon size={20} />
            <span className="text-sm md:text-base">{label}</span>
          </Link>
        ))}
      </nav>
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-white hover:bg-indigo-500/70 hover:text-white py-2 px-2 rounded-lg transition-colors duration-300"
        >
          <LogOut size={20} />
          <span className="text-sm md:text-base">Log-Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
