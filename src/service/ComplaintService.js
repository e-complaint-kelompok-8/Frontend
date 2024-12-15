import axiosInstance from "@config/axiosConfig";

const ComplaintService = {
  // Mengambil daftar complaint dengan filter
  getComplaints: async (categoryId, status, page = 1, limit = 10) => {
    try {
      const params = new URLSearchParams();

      if (categoryId && categoryId !== "ALL") {
        params.append("category_id", categoryId);
      }

      if (status && status !== "ALL") {
        params.append("status", status.toLowerCase());
      }
      
      params.append("page", page);
      params.append("limit", limit);

      const response = await axiosInstance.get(`/complaint/filter?${params}`);

      // Pastikan data yang dikembalikan memiliki struktur yang benar
      return {
        data: {
          complaints: response.data?.data?.complaints || [],
          total: response.data?.data?.total || 0,
          limit: response.data?.data?.limit || limit,
          page: response.data?.data?.page || page,
        },
      };
    } catch (error) {
      // Log error untuk debugging
      console.error("Error in getComplaints:", error);

      // Kembalikan data kosong jika terjadi error
      return {
        data: {
          complaints: [],
          total: 0,
          limit: limit,
          page: page,
        },
      };
    }
  },
  // Mengambil detail complaint
  getComplaintDetail: async (id) => {
    try {
      const response = await axiosInstance.get(`/complaint/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Menambahkan feedback
  addFeedback: async (complaintId, content) => {
    try {
      const response = await axiosInstance.post(`/complaint/feedback`, {
        complaint_id: parseInt(complaintId),
        content: content.trim(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update feedback yang sudah ada
  updateFeedback: async (feedbackId, content) => {
    try {
      const response = await axiosInstance.put(`/feedback/${feedbackId}`, {
        content: content.trim(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mengubah status complaint
  updateComplaintStatus: async (id, status) => {
    try {
      const response = await axiosInstance.put(`/complaint/status/${id}`, {
        status: status.toLowerCase(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mengupdate detail complaint
  updateComplaint: async (id, complaintData) => {
    try {
      const response = await axiosInstance.put(
        `/complaint/${id}`,
        complaintData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Menghapus complaint
  deleteComplaint: async (id) => {
    try {
      const response = await axiosInstance.delete(`/complaint/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ComplaintService;
