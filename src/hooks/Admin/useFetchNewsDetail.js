import { useState, useEffect } from "react";
import NewsService from "@services/Admin/NewsService";
import Swal from "sweetalert2";

export const useFetchNewsDetail = (id) => {
  const [newsData, setNewsData] = useState({
    title: "",
    content: "",
    category: "",
    date: "",
    photo_url: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        const response = await NewsService.getNewsDetail(id);
        const news = response.news;

        setNewsData({
          title: news.title,
          content: news.content,
          category:
            news.category?.id?.toString() || news.category_id?.toString(),
          date: news.date
            ? new Date(news.date).toISOString().split("T")[0]
            : "",
          photo_url: news.photo_url,
        });
      } catch (error) {
        console.error("Error fetching news detail:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal mengambil detail berita",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNewsDetail();
    }
  }, [id]);

  return { newsData, loading };
};
