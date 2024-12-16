import { useState, useEffect } from "react";
import NewsService from "@services/Admin/NewsService";
import Swal from "sweetalert2";

export const useFetchComments = (newsId) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await NewsService.getCommentsByIdNews(newsId);
        setComments(response.comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal mengambil komentar",
        });
      }
    };

    if (newsId) {
      fetchComments();
    }
  }, [newsId]);

  return comments;
};
