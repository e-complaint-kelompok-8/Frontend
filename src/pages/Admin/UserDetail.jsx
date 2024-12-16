import React, { useState, useEffect } from "react";
import {
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

import { useLocation, useNavigate, useParams } from "react-router-dom";

import UserService from "@services/Admin/UserService";

import Sidebar from "@components/Admin/Sidebar";
import Header from "@components/Admin/Header";
import BottomNavigation from "@components/Admin/BottomNavigation";

const UserDetailSkeleton = () => {
  return (
    <div className="mx-auto lg:px-4 md:px-4 animate-pulse">
      {/* Back Button */}
      <div className="mb-6">
        <div className="flex items-center text-gray-600">
          <ChevronLeft className="mr-2" />
          <span className="h-4 bg-gray-300 w-20 rounded"></span>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-300 mb-4 sm:mb-0 sm:mr-6"></div>
          <div className="text-center sm:text-left w-full">
            <div className="h-6 bg-gray-300 w-1/2 mx-auto sm:mx-0 mb-3 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 w-3/4 mx-auto sm:mx-0 rounded"></div>
              <div className="h-4 bg-gray-300 w-2/3 mx-auto sm:mx-0 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Total Complaints Section */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
        <div className="h-6 bg-gray-300 w-1/3 mb-4 rounded"></div>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg text-center">
            <div className="h-8 bg-gray-300 w-1/2 mx-auto mb-2 rounded"></div>
            <div className="h-4 bg-gray-300 w-1/3 mx-auto rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-gray-100 p-3 sm:p-4 rounded-lg text-center"
            >
              <div className="h-8 bg-gray-300 w-1/2 mx-auto mb-2 rounded"></div>
              <div className="h-4 bg-gray-300 w-1/3 mx-auto rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Complaint History Section */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-300 w-1/3 rounded"></div>
          <div className="h-6 w-6 bg-gray-300 rounded"></div>
        </div>

        <div className="mt-4 space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start border-b pb-4">
              <div className="mr-4 mt-1 w-5 h-5 bg-gray-300 rounded"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 mr-2">
                    <div className="h-5 bg-gray-300 w-1/2 mb-2 rounded"></div>
                    <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
                  </div>
                  <div className="h-5 w-16 bg-gray-300 rounded"></div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="h-4 bg-gray-300 w-1/2 rounded"></div>
                  <div className="h-4 bg-gray-300 w-1/4 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
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
    return <UserDetailSkeleton />;
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
