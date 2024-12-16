import axiosInstance from "@config/axiosConfig"; // Pastikan path ini sesuai dengan lokasi file axiosInstance Anda

const DashboardService = {
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

      return {
        data: {
          complaints: response.data?.data?.complaints || [],
          total: response.data?.data?.total || 0,
          limit: response.data?.data?.limit || limit,
          page: response.data?.data?.page || page,
        },
      };
    } catch (error) {
      console.error("Error in getComplaints:", error);
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

  getAllNews: async (page = 1, limit = 10) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    try {
      const response = await axiosInstance.get(`/news?${params}`);
      return response.data;
    } catch (error) {
      console.error("Error in getAllNews:", error);
      return {
        news: [],
        total: 0,
        limit: limit,
        page: page,
      };
    }
  },
};

export default DashboardService;
