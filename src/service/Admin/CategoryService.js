import axiosInstance from "@config/axiosConfig";
const CategoryService = {
  getCategories: async () => {
    try {
      const response = await axiosInstance.get("/category");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
};
export default CategoryService;
