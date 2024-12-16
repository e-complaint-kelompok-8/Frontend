import axiosInstance from "@config/axiosConfig";

const UserService = {
  getAllUsers: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get("/users", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserDetail: async (id) => {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default UserService;
