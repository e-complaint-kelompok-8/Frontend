import React, { useState } from "react";
import { ChevronDown, FileUp, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useFetchCategories } from "@hooks/Admin/useFetchCategories";
import { useFetchComplaints } from "@hooks/Admin/useFetchComplaints";
import { usePagination } from "@hooks/Admin/usePagination";

import ComplaintListSkeleton from "./ComplaintListSkeleton";
import EmptyDataState from "./EmptyDataState";

import Swal from "sweetalert2";
import ComplaintService from "@services/Admin/ComplaintService";

const ComplaintList = () => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedComplaints, setSelectedComplaints] = useState([]);

  const { currentPage, handlePageChange } = usePagination();
  const { categories, loading: categoriesLoading } = useFetchCategories();
  const {
    complaints,
    loading: complaintsLoading,
    totalPages,
  } = useFetchComplaints(selectedCategory, selectedStatus, currentPage);

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

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    handlePageChange(1, totalPages);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    handlePageChange(1, totalPages);
  };

  const handleSelectComplaint = (id) => {
    setSelectedComplaints((prev) =>
      prev.includes(id)
        ? prev.filter((complaintId) => complaintId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedComplaints(
      selectedComplaints.length === complaints.length
        ? []
        : complaints.map((c) => c.id)
    );
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
    } catch (error) {
      console.error("Error deleting complaints:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menghapus pengaduan",
      });
    }
  };

  return (
    <div className="space-y-4 md:px-4 lg:px-4">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Daftar Complaint</h1>
          <button
            onClick={() =>
              Swal.fire({
                icon: "info",
                title: "Segera Hadir",
                text: "Fitur import CSV akan segera tersedia",
              })
            }
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm md:text-base whitespace-nowrap"
          >
            <FileUp size={18} className="mr-2" />
            <span>Import CSV</span>
          </button>
        </div>

        <div className="flex flex-row gap-4">
          <div className="relative flex-1">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="appearance-none w-full px-3 md:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-8 text-sm md:text-base text-gray-700"
            >
              {categoriesLoading ? (
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
              {[
                { value: "ALL", label: "Semua Status" },
                { value: "proses", label: "Dalam Proses" },
                { value: "tanggapi", label: "Tanggapi" },
                { value: "selesai", label: "Selesai" },
                { value: "batal", label: "Dibatalkan" },
              ].map((status) => (
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

      {complaintsLoading ? (
        <ComplaintListSkeleton />
      ) : complaints.length === 0 ? (
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
                  className="mr-2 h-5 w-5"
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

      {!complaintsLoading && complaints.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-6 pb-16 md:pb-8">
          <button
            onClick={() => handlePageChange(currentPage - 1, totalPages)}
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
                  onClick={() => handlePageChange(pageNumber, totalPages)}
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
            onClick={() => handlePageChange(currentPage + 1, totalPages)}
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

export default ComplaintList;
