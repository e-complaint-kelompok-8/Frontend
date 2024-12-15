import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Edit,
  MessageSquare,
  PieChart,
  Search,
  Users,
  User,
  X,
  Mail,
  Phone,
  Hospital,
  TrafficCone,
  TreePine,
  School,
  ShieldAlert,
  AlertCircle,
  Construction,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import UserService from "@services/UserService";

const Sidebar = ({ className, onClose }) => {
  const location = useLocation();

  const isActivePath = (path) => {
    switch (path) {
      case "/admin/complaints":
        return location.pathname.startsWith("/admin/complaint");
      case "/admin/public-services":
        return location.pathname.startsWith("/admin/news");
      case "/admin/users":
        return location.pathname.startsWith("/admin/user");
      default:
        return location.pathname === path;
    }
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
          {
            icon: MessageSquare,
            label: "Complaint",
            path: "/admin/complaints",
          },
          {
            icon: Users,
            label: "Public Services",
            path: "/admin/public-services",
          },
          { icon: Users, label: "Users", path: "/admin/users" },
        ].map(({ icon: Icon, label, path }) => (
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
        <a
          href="#"
          className="flex items-center space-x-2 text-white hover:bg-indigo-500/70 hover:text-white py-2 px-2 rounded-lg transition-colors duration-300"
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
    switch (path) {
      case "/admin/complaints":
        return location.pathname.startsWith("/admin/complaint");
      case "/admin/public-services":
        return location.pathname.startsWith("/admin/news");
      default:
        return location.pathname === path;
    }
  };

  const navItems = [
    { icon: PieChart, label: "Dashboard", path: "/admin/dashboard" },
    { icon: MessageSquare, label: "Complaint", path: "/admin/complaints" },
    { icon: Users, label: "Services", path: "/admin/public-services" },
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

const Header = () => {
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Mock data dengan nama pengirim
  const recentComplaints = [
    {
      id: 1,
      sender: "John Doe",
      title: "Jalanan Bolong",
      status: "Belum Ditangani",
    },
    {
      id: 2,
      sender: "Jane Smith",
      title: "Macet Di Tol Cikupa",
      status: "Belum Ditangani",
    },
    {
      id: 3,
      sender: "Alex Johnson",
      title: "Keluhan Produk",
      status: "Belum Ditangani",
    },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotificationDropdown(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    navigate("/edit-profile");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Search Section */}
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

          {/* Notification and Profile Section */}
          <div className="flex items-center space-x-4 ">
            {/* Notification Dropdown */}
            <div className="relative mt-2" ref={notificationRef}>
              <button
                className="relative"
                onClick={() =>
                  setShowNotificationDropdown(!showNotificationDropdown)
                }
              >
                <Bell className="h-6 w-6 text-gray-400" />
                {recentComplaints.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 transform translate-x-1/2 -translate-y-1/2"></span>
                )}
              </button>

              {showNotificationDropdown && (
                <div
                  className="fixed md:absolute top-16 md:top-auto right-4 md:right-0 md:mt-4 
            w-[calc(100%-2rem)] md:w-96 
            bg-white border-none rounded-lg shadow-2xl 
            z-50
            md:before:content-[''] md:before:absolute md:before:border-l-8 md:before:border-r-8 md:before:border-b-8 
            md:before:border-l-transparent md:before:border-r-transparent md:before:border-b-white 
            md:before:-top-2 md:before:right-2 md:before:rotate-180 mt-1"
                >
                  <div className="p-4 bg-white rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold">
                        Komplain Terbaru
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {recentComplaints.map((complaint) => (
                        <div
                          key={complaint.id}
                          className="py-3 border-b last:border-b-0 flex items-center hover:bg-gray-50 cursor-pointer rounded-lg transition-colors duration-200"
                        >
                          <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                            {complaint.senderAvatar ? (
                              <img
                                src={complaint.senderAvatar}
                                alt={complaint.sender}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-600 text-lg">
                                {complaint.sender.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="ml-3 flex-grow">
                            <p className="text-sm font-medium text-gray-800">
                              {complaint.sender} Baru Saja Complaint
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-48">
                              {complaint.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {recentComplaints.length > 0 && (
                      <div className="mt-3 text-center">
                        <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                          Lihat Semua Komplain
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Section */}
            <div className="relative" ref={profileRef}>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">Halo ! Adam</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronRight
                  size={20}
                  className={`transition-transform duration-300 ${
                    showProfileDropdown ? "rotate-90" : ""
                  }`}
                />
              </div>

              {showProfileDropdown && (
                <div
                  className="fixed md:absolute top-16 md:top-auto right-4 md:right-0 md:mt-4 
                  w-[calc(50%-2rem)] md:w-48 
                  bg-white border-none rounded-lg shadow-2xl 
                  z-50
                  md:before:content-[''] md:before:absolute md:before:border-l-8 md:before:border-r-8 md:before:border-b-8 
                  md:before:border-l-transparent md:before:border-r-transparent md:before:border-b-white 
                  md:before:-top-2 md:before:right-2 md:before:rotate-180 mt-1"
                >
                  <div className="py-1 bg-white rounded-lg shadow-lg">
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Edit className="h-5 w-5 text-gray-500" />
                      <span>Edit Profil</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2">
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

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [openHistoryDropdown, setOpenHistoryDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      setLoading(true);
      try {
        const response = await UserService.getUserDetail(id);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  const renderComplaintIcon = (category) => {
    switch (category.name) {
      case "Kesehatan":
        return <Hospital size={20} className="text-blue-500" />;
      case "Infrastruktur":
        return <Construction size={20} className="text-gray-500" />;
      case "Transportasi":
        return <TrafficCone size={20} className="text-yellow-500" />;
      case "Lingkungan":
        return <TreePine size={20} className="text-green-500" />;
      case "Pendidikan":
        return <School size={20} className="text-purple-500" />;
      case "Keamanan":
        return <ShieldAlert size={20} className="text-red-500" />;
      default:
        return <AlertCircle size={20} className="text-gray-500" />;
    }
  };

  const gridColumnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "proses":
        return "bg-yellow-100 text-yellow-800";
      case "selesai":
        return "bg-green-100 text-green-800";
      case "batal":
        return "bg-red-100 text-red-800";
      case "tanggapi":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">User tidak ditemukan</p>
      </div>
    );
  }

  const totalComplaints = user.complaints ? user.complaints.length : 0;

  const complaintStatusCount = user.complaints
    ? user.complaints.reduce((acc, complaint) => {
        acc[complaint.status] = (acc[complaint.status] || 0) + 1;
        return acc;
      }, {})
    : {};

  const sortedComplaints = user.complaints
    ? user.complaints.sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];

  return (
    <div className="mx-auto lg:px-4 md:px-4">
      <div className="mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="mr-2" />
          <span className="text-sm md:text-base">Kembali</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
            {user.photo_url ? (
              <img
                src={user.photo_url}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-gray-700">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
              {user.name}
            </h1>
            <div className="text-gray-500 space-y-1 mt-2 text-sm sm:text-base">
              <p className="flex items-center justify-center sm:justify-start">
                <Mail size={16} className="mr-2 text-gray-400" /> {user.email}
              </p>
              <p className="flex items-center justify-center sm:justify-start">
                <Phone size={16} className="mr-2 text-gray-400" /> {user.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          Total Komplain
        </h2>
        {/* Bagian Total */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg text-center">
            <p className="text-xl sm:text-2xl font-bold text-gray-800">
              {totalComplaints}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">Total Komplain</p>
          </div>
        </div>
        {/* Bagian Status */}
        <div
          className={`grid ${
            gridColumnClasses[Object.keys(complaintStatusCount).length]
          } gap-4 mt-4`}
        >
          {Object.entries(complaintStatusCount).map(([status, count]) => (
            <div
              key={status}
              className="bg-gray-100 p-3 sm:p-4 rounded-lg text-center"
            >
              <p className="text-xl sm:text-2xl font-bold text-gray-800">
                {count}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 capitalize">
                {status === "in-progress"
                  ? "Dalam Proses"
                  : status === "resolved"
                  ? "Selesai"
                  : status === "open"
                  ? "Batal"
                  : status}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setOpenHistoryDropdown(!openHistoryDropdown)}
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Riwayat Komplain
          </h2>
          <ChevronRight
            className={`transition-transform duration-300 ${
              openHistoryDropdown ? "rotate-90" : ""
            }`}
          />
        </div>

        {openHistoryDropdown && (
          <div className="mt-4">
            {sortedComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="flex items-start border-b pb-4 last:border-b-0 mb-4"
              >
                <div className="mr-4 mt-1">
                  {renderComplaintIcon(complaint.category)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 mr-2">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800">
                        {complaint.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {complaint.description}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getStatusColor(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <p className="w-2/3">Lokasi: {complaint.location}</p>
                    <p className="flex-grow text-right">
                      {formatDate(complaint.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {sortedComplaints.length === 0 && (
              <p className="text-gray-500 text-center text-sm sm:text-base">
                Tidak ada riwayat komplain
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function UserDetail() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 pb-16 md:pb-16 lg:pb-0">
      {/* Persistent Sidebar for Large Screens */}
      <Sidebar className="hidden lg:block w-64 fixed h-full" />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
            <Detail />
          </div>
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
}
