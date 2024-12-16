import { useState, useEffect } from "react";
import CategoryService from "@services/Admin/CategoryService";
import Swal from "sweetalert2";

export const useFetchCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getCategories();
        setCategories([{ id: "ALL", name: "Semua Kategori" }, ...response]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal mengambil data kategori",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};
