import React, { useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  MessageSquare,
  PieChart,
  Search,
  Settings,
  Users,
  User,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ className, onClose }) => {
  const location = useLocation();

  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

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
        {[
          { icon: PieChart, label: "Dashboard", path: "/admin/dashboard" },
          { icon: MessageSquare, label: "Complaint", path: "/admin/complaint" },
          {
            icon: Users,
            label: "Public Services",
            path: "/admin/public-services",
          },
          { icon: Settings, label: "Category", path: "/admin/category" },
          { icon: User, label: "User", path: "/admin/user" },
          { icon: Settings, label: "Setting", path: "/admin/setting" },
        ].map(({ icon: Icon, label, path }) => (
          <Link
            key={label}
            to={path}
            className={`flex items-center space-x-2 py-2 px-2 rounded-lg transition-colors ${
              isActivePath(path)
                ? "bg-white text-indigo-700" // Active styles
                : "text-white hover:text-indigo-200 hover:bg-indigo-600" // Default styles
            }`}
          >
            <Icon size={20} />
            <span className="text-sm md:text-base">{label}</span>
          </Link>
        ))}
      </nav>
      <div>
        <a
          href="#"
          className="flex items-center space-x-2 text-white hover:text-indigo-200 py-2 px-2 rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm md:text-base">Log-Out</span>
        </a>
      </div>
    </div>
  );
};
const BottomNavigation = () => {
  const location = useLocation();

  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { icon: PieChart, label: "Dashboard", path: "/admin/dashboard" },
    { icon: MessageSquare, label: "Complaint", path: "/admin/complaint" },
    { icon: Users, label: "Services", path: "/admin/public-services" },
    { icon: Settings, label: "Category", path: "/admin/category" },
    { icon: User, label: "Users", path: "/admin/users" },
  ];

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

const MetricCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="text-xl md:text-2xl font-bold mt-1">{value}</p>
  </div>
);

const Chart = () => (
  <div className="h-[200px] md:h-[300px] mt-4">
    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
      Chart Placeholder
    </div>
  </div>
);

const RecentComplaints = () => (
  <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
    <h2 className="text-lg font-semibold mb-4">Recent Complaint</h2>
    <div className="space-y-4">
      {[
        {
          name: "Francisco Gibbs",
          complaint: "Kebakaran hutan",
          time: "Just now",
        },
        {
          name: "Adam Kurniawan",
          complaint: "Banjir",
          time: "Friday 12:26PM",
        },
      ].map((item, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-lg"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{item.name}</p>
            <p className="text-sm text-gray-500 truncate">
              Created Complaint {item.complaint}
            </p>
            <p className="text-xs text-gray-400">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RecentUsers = () => (
  <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
    <h2 className="text-lg font-semibold mb-4">Recent User</h2>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <th className="pb-2 px-2">No Complaint</th>
            <th className="pb-2 px-2">Date Created</th>
            <th className="pb-2 px-2">Client</th>
            <th className="pb-2 px-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((_, index) => (
            <tr key={index} className="border-t hover:bg-gray-50">
              <td className="py-2 px-2">ZR-22222</td>
              <td className="py-2 px-2">3 Jul, 2020</td>
              <td className="py-2 px-2">Adam kurniawan</td>
              <td className="py-2 px-2">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  PAID
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function Dashboard() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 pb-16 md:pb-16 lg:pb-0">
      {/* Persistent Sidebar for Large Screens */}
      <Sidebar className="hidden lg:block w-64 fixed h-full" />

      <div className="flex-1 flex flex-col lg:ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center flex-1">
                <div className={`flex items-center w-full max-w-md relative`}>
                  <Search className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
                  <input
                    type="search"
                    placeholder="Cari Disini"
                    className="w-full pl-10 pr-4 py-2 mr-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button className="relative">
                  <Bell className="h-6 w-6 text-gray-400" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 transform translate-x-1/2 -translate-y-1/2"></span>
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">Halo ! Adam</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title="Complaint Masuk" value={20} />
              <MetricCard title="Feedback Selesai" value={20} />
              <MetricCard title="Category Complaint" value={20} />
              <MetricCard title="Import CSV" value={20} />
            </div>

            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold mb-4">Complaint Grafik</h2>
              <Chart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentComplaints />
              <RecentUsers />
            </div>
          </div>
        </main>

        {/* Bottom Navigation for Mobile and Tablet */}
        <BottomNavigation />
      </div>
    </div>
  );
}
