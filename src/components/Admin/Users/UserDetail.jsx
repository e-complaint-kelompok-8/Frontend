// components/UserDetail/UserDetail.js
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Hospital,
  TrafficCone,
  TreePine,
  School,
  ShieldAlert,
  AlertCircle,
  Construction, // Pastikan ikon ini diimpor
} from "lucide-react";
import useUserDetail from "@hooks/Admin/useUserDetail";
import UserDetailSkeleton from "./UserDetailSkeleton";
import UserProfile from "./UserProfile";
import TotalComplaints from "./TotalComplaints";
import ComplaintHistory from "./ComplaintHistory";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useUserDetail(id);

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

  const totalComplaints = user?.complaints ? user.complaints.length : 0;

  const complaintStatusCount = user?.complaints
    ? user.complaints.reduce((acc, complaint) => {
        acc[complaint.status] = (acc[complaint.status] || 0) + 1;
        return acc;
      }, {})
    : {};

  const sortedComplaints = user?.complaints
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
      {loading ? (
        <UserDetailSkeleton />
      ) : (
        <div>
          <UserProfile user={user} />
          <TotalComplaints
            totalComplaints={totalComplaints}
            complaintStatusCount={complaintStatusCount}
          />
          <ComplaintHistory
            sortedComplaints={sortedComplaints}
            renderComplaintIcon={renderComplaintIcon}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        </div>
      )}
    </div>
  );
};

export default UserDetail;
