import React, { useState, useRef, useEffect } from "react";
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
  FileUp,
  Edit,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import Swal from "sweetalert2";
import { useLocation, Link, useNavigate } from "react-router-dom";
import ComplaintService from "@services/ComplaintService";

const Sidebar = ({ className, onClose }) => {
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

const EmptyState = ({
  selectedCategory,
  selectedStatus,
  complaintCategories,
  complaintStatuses,
}) => {
  const getMessage = () => {
    const categoryName = complaintCategories.find(
      (cat) => cat.value === selectedCategory
    )?.label;
    const statusName = complaintStatuses.find(
      (stat) => stat.value === selectedStatus
    )?.label;

    if (selectedCategory !== "ALL" && selectedStatus !== "ALL") {
      return {
        title: "Tidak ada pengaduan ditemukan",
        description: `Belum ada pengaduan dengan kategori "${categoryName}" dan status "${statusName}"`,
      };
    } else if (selectedCategory !== "ALL") {
      return {
        title: "Kategori masih kosong",
        description: `Belum ada pengaduan dalam kategori "${categoryName}"`,
      };
    } else if (selectedStatus !== "ALL") {
      return {
        title: "Status tidak ditemukan",
        description: `Tidak ada pengaduan dengan status "${statusName}"`,
      };
    }
    return {
      title: "Belum ada pengaduan",
      description: "Saat ini belum ada pengaduan yang masuk ke sistem",
    };
  };

  const message = getMessage();

  return (
    <div className="bg-white rounded-lg p-8">
      <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center">
        <div className="w-48 h-48 mb-6 relative">
          <div className="absolute inset-0 bg-indigo-100 rounded-full opacity-20"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-24 h-24 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {message.title}
        </h3>
        <p className="text-gray-600 mb-8">{message.description}</p>
      </div>
    </div>
  );
};

const ComplaintList = () => {
  // State Management
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComplaints, setTotalComplaints] = useState(0);

  const complaintCategories = [
    { value: "ALL", label: "Semua Kategori" },
    { value: "1", label: "Infrastruktur" },
    { value: "2", label: "Transportasi" },
    { value: "3", label: "Kesehatan" },
    { value: "4", label: "Lingkungan" },
    { value: "5", label: "Keamanan" },
    { value: "6", label: "Pendidikan" },
  ];

  const complaintStatuses = [
    { value: "ALL", label: "Semua Status" },
    { value: "proses", label: "Dalam Proses" },
    { value: "tanggapi", label: "Tanggapi" },
    { value: "selesai", label: "Selesai" },
    { value: "batal", label: "Dibatalkan" },
  ];

  useEffect(() => {
    setCurrentPage(1); // Reset ke halaman pertama ketika filter berubah
    fetchComplaints();
  }, [selectedCategory, selectedStatus]);

  useEffect(() => {
    fetchComplaints();
  }, [currentPage]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset halaman saat kategori berubah
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1); // Reset halaman saat status berubah
  };

  const handleImportCSV = () => {
    Swal.fire({
      icon: "info",
      title: "Segera Hadir",
      text: "Fitur import CSV akan segera tersedia",
    });
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await ComplaintService.getComplaints(
        selectedCategory,
        selectedStatus,
        currentPage,
        10
      );

      setComplaints(response.data.complaints);
      setTotalPages(Math.ceil(response.data.total / response.data.limit));
      setTotalComplaints(response.data.total);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Mengambil Data",
        text: error.response?.data?.message || "Gagal mengambil data pengaduan",
      });
    } finally {
      setLoading(false);
    }
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
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-indigo-200 rounded-full animate-spin"></div>
        <div className="w-12 h-12 border-4 border-indigo-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 md:px-4 lg:px-4">
      <div className="flex flex-col gap-4 mb-4">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Daftar Pengaduan
            </h1>
            <p className="text-sm text-gray-600">
              Total {totalComplaints} pengaduan
            </p>
          </div>
          <button
            onClick={handleImportCSV}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm md:text-base whitespace-nowrap"
          >
            <FileUp size={18} className="mr-2" />
            <span>Import CSV</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-row  gap-4">
          <div className="relative flex-1">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange} // Gunakan handler baru
              className="appearance-none w-full px-3 md:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-8 text-sm md:text-base text-gray-700"
            >
              {complaintCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              size={20}
            />
          </div>

          <div className="relative flex-1">
            <select
              value={selectedStatus}
              onChange={handleStatusChange} // Gunakan handler baru
              className="appearance-none w-full px-3 md:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-8 text-sm md:text-base text-gray-700"
            >
              {complaintStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              size={20}
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <LoadingSpinner />
      ) : complaints.length === 0 ? (
        <EmptyState
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          complaintCategories={complaintCategories}
          complaintStatuses={complaintStatuses}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
          {complaints.map((complaint) => (
            <Link
              key={complaint.id}
              to={`/admin/complaint/${complaint.id}`}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                    {complaint.user?.photo_url ? (
                      <img
                        src={complaint.user.photo_url}
                        alt={complaint.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-semibold">
                        {complaint.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm md:text-base lg:text-lg">
                      {complaint.user?.name}
                    </h3>
                    <p className="text-xs md:text-sm lg:text-base text-gray-600">
                      {complaint.complaint_number}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(
                    complaint.status
                  )}`}
                >
                  {complaint.status.charAt(0).toUpperCase() +
                    complaint.status.slice(1)}
                </span>
              </div>
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 text-sm md:text-base lg:text-lg">
                  {complaint.title}
                </h4>
                <p className="text-xs md:text-sm lg:text-base text-gray-600 mt-1 line-clamp-2">
                  {complaint.description}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs md:text-sm lg:text-base text-gray-500">
                <span>{complaint.category?.name}</span>
                <span>
                  {new Date(complaint.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && complaints.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-6 pb-16 md:pb-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            « Previous
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 rounded ${
                    pageNumber === currentPage
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            } else if (
              pageNumber === currentPage - 2 ||
              pageNumber === currentPage + 2
            ) {
              return (
                <span key={pageNumber} className="px-2">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Next »
          </button>
        </div>
      )}
    </div>
  );
};

//

export default function Complaints() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
