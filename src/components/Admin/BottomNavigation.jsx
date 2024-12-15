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
    if (path === "/") return location.pathname === path;
    if (path === "/users") return location.pathname.startsWith("/user");
    if (path === "/public-services" && location.pathname.startsWith("/news"))
      return true;
    return location.pathname.startsWith(path);
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
