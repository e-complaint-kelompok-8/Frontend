import { useState, useEffect } from "react";
import ComplaintService from "@services/Admin/ComplaintService";
import Swal from "sweetalert2";

export const useFetchComplaints = (
  selectedCategory,
  selectedStatus,
  currentPage
) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
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
      } catch (error) {
        console.error("Error fetching complaints:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal Mengambil Data",
          text:
            error.response?.data?.message || "Gagal mengambil data pengaduan",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [selectedCategory, selectedStatus, currentPage]);

  return { complaints, loading, totalPages };
};
