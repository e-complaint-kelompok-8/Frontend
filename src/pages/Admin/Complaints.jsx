import React, { useState, useEffect } from "react";
import { ChevronDown, FileUp, Trash2, Search } from "lucide-react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

import ComplaintService from "@services/ComplaintService";
import CategoryService from "@services/CategoryService";

import Header from "@components/Admin/Header";
import Sidebar from "@components/Admin/Sidebar";
import BottomNavigation from "@components/Admin/BottomNavigation";

const ComplaintListSkeleton = () => {
  return (
    <div className="space-y-4 md:px-4 lg:px-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>

      {/* Filter Controls Skeleton */}
      <div className="flex flex-row gap-4">
        <div className="relative flex-1 h-10 bg-gray-200 rounded"></div>
        <div className="relative flex-1 h-10 bg-gray-200 rounded"></div>
      </div>

      {/* Complaint Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <div key={item} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>

              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="mt-4">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="w-8 h-8 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
};
const EmptyDataState = ({ type = "category", onRetry, message }) => {
  const renderIcon = () => {
    return (
      <div className="text-indigo-500 mb-4">
        <Search className="w-16 h-16 mx-auto" />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50 rounded-lg shadow-lg p-8 text-center border border-gray-200">
      {renderIcon()}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {message || `Tidak ada ${type === "category" ? "Kategori" : "Status"}`}
      </h2>
      <p className="text-gray-600 text-sm mb-4">
        Tidak ada data yang tersedia untuk dipilih.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center justify-center px-5 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-transform transform hover:scale-105"
        >
          <RefreshCw size={16} className="mr-2" />
          Muat Ulang
        </button>
      )}
    </div>
  );
};
const ComplaintList = () => {
  // State Management
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComplaints, setTotalComplaints] = useState(0);
  const [selectedComplaints, setSelectedComplaints] = useState([]);

  const complaintStatuses = [
    { value: "ALL", label: "Semua Status" },
    { value: "proses", label: "Dalam Proses" },
    { value: "tanggapi", label: "Tanggapi" },
    { value: "selesai", label: "Selesai" },
    { value: "batal", label: "Dibatalkan" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getCategories();
        const fetchedCategories = response || [];
        setCategories([
          { id: "ALL", name: "Semua Kategori" },
          ...fetchedCategories,
        ]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal mengambil data kategori",
        });
      }
    };

    fetchCategories();
  }, []);

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

  const handleSelectComplaint = (id) => {
    if (selectedComplaints.includes(id)) {
      setSelectedComplaints(
        selectedComplaints.filter((complaintId) => complaintId !== id)
      );
    } else {
      setSelectedComplaints([...selectedComplaints, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedComplaints.length === complaints.length) {
      setSelectedComplaints([]);
    } else {
      setSelectedComplaints(complaints.map((complaint) => complaint.id));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await ComplaintService.bulkDelete(selectedComplaints);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Pengaduan berhasil dihapus",
        timer: 1500,
        showConfirmButton: false,
      });
      setSelectedComplaints([]);
      fetchComplaints(); // Refresh complaints after deletion
    } catch (error) {
      console.error("Error deleting complaints:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menghapus pengaduan",
      });
    }
  };

  if (loading) {
    return <ComplaintListSkeleton />;
  }

  return (
    <div className="space-y-4 md:px-4 lg:px-4">
      <div className="flex flex-col gap-4 mb-4">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Daftar Pengaduan
            </h1>
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
        <div className="flex flex-row gap-4">
          <div className="relative flex-1">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="appearance-none w-full px-3 md:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-8 text-sm md:text-base text-gray-700"
            >
              {loading ? (
                <option value="all">Semua Kategori</option>
              ) : (
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              size={20}
            />
          </div>

          <div className="relative flex-1">
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
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

      {/* Bulk Delete Button */}
      {selectedComplaints.length > 0 && (
        <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg mb-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedComplaints.length === complaints.length}
              onChange={handleSelectAll}
              className="mr-2"
            />
            <span className="text-blue-600 font-semibold text-xs sm:text-sm md:text-base">
              {selectedComplaints.length} pengaduan dipilih
            </span>
          </div>
          <button
            onClick={handleBulkDelete}
            className="flex items-center text-red-500 hover:text-red-600 text-xs sm:text-sm md:text-base"
          >
            <Trash2 className="mr-1" />
            Hapus Terpilih
          </button>
        </div>
      )}

      {/* Content Section */}
      {complaints.length === 0 ? (
        <EmptyDataState type="status" message="Complaint Tidak Tersedia" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <input
                  type="checkbox"
                  checked={selectedComplaints.includes(complaint.id)}
                  onChange={() => handleSelectComplaint(complaint.id)}
                  className="mr-2"
                />
                <Link
                  to={`/admin/complaint/${complaint.id}`}
                  className="flex-1"
                >
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
                      <p className="block md:hidden text-xs text-gray-600">
                        {complaint.complaint_number}
                      </p>
                      <div className="hidden md:flex items-center space-x-2">
                        <p className="text-sm lg:text-base text-gray-600">
                          {complaint.complaint_number}
                        </p>
                        <span className="text-sm lg:text-base text-gray-500">
                          {new Date(complaint.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                <span
                  className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium block md:hidden ${getStatusColor(
                    complaint.status
                  )}`}
                >
                  {complaint.status.charAt(0).toUpperCase() +
                    complaint.status.slice(1)}
                </span>
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm lg:text-base text-gray-500">
                    {complaint.category?.name}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      complaint.status
                    )}`}
                  >
                    {complaint.status.charAt(0).toUpperCase() +
                      complaint.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 text-sm md:text-base lg:text-lg">
                  {complaint.title}
                </h4>
                <p className="text-xs md:text-sm lg:text-base text-gray-600 mt-1 line-clamp-2">
                  {complaint.description}
                </p>
              </div>
              <div className="mt-4 md:hidden flex items-center justify-between text-xs text-gray-500">
                <span>{complaint.category?.name}</span>
                <span>
                  {new Date(complaint.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
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

export default function Complaints() {
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
