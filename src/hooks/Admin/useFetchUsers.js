import { useState, useEffect } from "react";
import UserService from "@services/Admin/UserService";

export const useFetchUsers = (currentPage, limit) => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await UserService.getAllUsers(currentPage, limit);
        setUsers(data.data || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, limit]);

  return { users, totalPages, loading };
};
