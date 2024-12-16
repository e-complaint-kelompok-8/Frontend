import axiosInstanceUser from "@config/axiosInstanceUser";

export const fetchNews = async () => {
  try {
    const response = await axiosInstanceUser.get(`/news`);
    console.log("Fetched news:", response.data);
    return response.data.news; // Mengembalikan array berita
  } catch (error) {
    console.error(
      "Error fetching news:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchNewsDetail = async (id) => {
  try {
    const response = await axiosInstanceUser.get(`/news/${id}`);
    console.log("Fetched news detail:", response.data);
    return response.data.news; // Mengembalikan detail berita
  } catch (error) {
    console.error(
      "Error fetching news detail:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addComment = async (newsId, content) => {
  const payload = {
    news_id: parseInt(newsId, 10), // Pastikan news_id adalah angka
    content: content.trim(), // Hapus spasi berlebih di awal/akhir
  };

  try {
    const response = await axiosInstanceUser.post(`/comment`, payload);

    console.log("Comment added:", response.data);
    return response.data.comment;
  } catch (error) {
    console.error(
      "Error adding comment:",
      error.response?.data || error.message
    );
    throw error;
  }
};
