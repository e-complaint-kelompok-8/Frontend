import { useState, useEffect, useCallback } from "react";
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
  const [error, setError] = useState(null); // Tambahkan state untuk error

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state sebelum fetch
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
      setError(error); // Simpan error ke state
      Swal.fire({
        icon: "error",
        title: "Gagal Mengambil Data",
        text: error.response?.data?.message || "Gagal mengambil data pengaduan",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, currentPage]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  return { complaints, loading, totalPages, error, refetch: fetchComplaints }; // Kembalikan refetch
};
