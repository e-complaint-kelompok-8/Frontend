// hooks/useUserDetail.js
import { useState, useEffect } from "react";
import UserService from "@services/Admin/UserService";

const useUserDetail = (id) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      setLoading(true);
      try {
        const response = await UserService.getUserDetail(id);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  return { user, loading };
};

export default useUserDetail;
