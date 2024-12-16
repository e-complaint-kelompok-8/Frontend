import { useState, useEffect } from "react";
import CategoryService from "@services/Admin/CategoryService";
import Swal from "sweetalert2";

export const useFetchCategoriesNews = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getCategories();
        setCategories(response || []);
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

  return categories;
};
