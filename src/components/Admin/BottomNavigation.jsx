import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PieChart, MessageSquare, Users, User } from "lucide-react";

const BottomNavigation = ({ isLoading }) => {
  const location = useLocation();

  const navItems = [
    { icon: PieChart, label: "Dashboard", path: "/admin/dashboard" },
    { icon: MessageSquare, label: "Complaint", path: "/admin/complaints" },
    { icon: Users, label: "Services", path: "/admin/public-services" },
    { icon: User, label: "Users", path: "/admin/users" },
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
  const BottomNavigationSkeleton = () => {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:block lg:hidden animate-pulse">
        <div className="flex justify-around py-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex flex-col items-center py-1 px-2 rounded-lg"
            >
              {/* Icon Skeleton */}
              <div className="h-7 w-7 bg-gray-300 rounded-full mb-1"></div>

              {/* Label Skeleton */}
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <BottomNavigationSkeleton />;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:block lg:hidden">
      <div className="flex justify-around py-2">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={label}
            to={path}
            className={`flex flex-col items-center py-1 px-2 rounded-lg ${
              isActivePath(path)
                ? "text-indigo-700"
                : "text-gray-500 hover:text-indigo-700"
            }`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
