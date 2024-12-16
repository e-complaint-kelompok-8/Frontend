import axiosInstance from "@config/axiosConfig";
import CloudinaryService from "@services/Admin/CloudinaryService";

const NewsService = {
  // src/services/NewsService.js
  getAllNews: async (page = 1, limit = 10) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    try {
      const response = await axiosInstance.get(`/news?${params}`);
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getNewsDetail: async (id) => {
    try {
      const response = await axiosInstance.get(`/news/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createNews: async (data) => {
    try {
      // Upload image ke Cloudinary jika ada
      let photoUrl = null;
      if (data.image) {
        const imageData = await CloudinaryService.uploadImage(data.image);
        photoUrl = imageData.url;
      }

      // Prepare data sesuai format yang diminta BE
      const newsData = {
        admin_id: data.admin_id,
        category_id: parseInt(data.category_id),
        title: data.title,
        content: data.content,
        photo_url: photoUrl,
        date: data.date,
      };

      console.log(newsData);

      const response = await axiosInstance.post("/news", newsData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateNews: async (id, data) => {
    try {
      let imageData = null;

      // Jika ada gambar baru
      if (data.new_image instanceof File) {
        console.log("Gambar Baru", data.new_image);
        console.log("Gambar Lama", data.old_photo_url);
        try {
          // Hapus gambar lama terlebih dahulu jika ada
          if (data.old_photo_url) {
            const urlParts = data.old_photo_url.split("/");
            const publicId = `capstone-altera/${
              urlParts[urlParts.length - 1].split(".")[0]
            }`;
            await CloudinaryService.deleteImage(publicId);
          }

          // Upload gambar baru
          imageData = await CloudinaryService.uploadImage(data.new_image);
        } catch (error) {
          console.error("Error handling image:", error);
          throw new Error("Gagal mengelola gambar");
        }
      }

      // Prepare data untuk API
      const newsData = {
        admin_id: data.admin_id,
        title: data.title,
        content: data.content,
        category_id: data.category_id,
        date: data.date,
        photo_url: imageData ? imageData.url : data.photo_url,
      };

      const response = await axiosInstance.put(`/news/${id}`, newsData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteNews: async (ids) => {
    try {
      // Dapatkan detail berita untuk setiap ID
      const newsToDelete = await Promise.all(
        ids.map(async (id) => {
          const response = await NewsService.getNewsDetail(id);
          return response.news;
        })
      );

      // Hapus gambar dari Cloudinary untuk setiap berita
      await Promise.all(
        newsToDelete.map(async (news) => {
          if (news.photo_url) {
            try {
              const urlParts = news.photo_url.split("/");
              const publicId = `capstone-altera/${
                urlParts[urlParts.length - 1].split(".")[0]
              }`;

              console.log("Deleting image with public_id:", publicId);
              await CloudinaryService.deleteImage(publicId);
            } catch (error) {
              console.error(`Error deleting image for news ${news.id}:`, error);
            }
          }
        })
      );

      // Hapus berita dari database
      const response = await axiosInstance.delete("/news/bulk-delete", {
        data: ids,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getComments: async (newsId) => {
    try {
      const response = await axiosInstance.get(`/comment/${newsId}`);
      console.log("respon be", response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCommentsByIdNews: async (newsId) => {
    try {
      const response = await axiosInstance.get(`/news/${newsId}/comment`);
      console.log("respon be", response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteComments: async (commentIds) => {
    try {
      const response = await axiosInstance.delete("/comment", {
        data: commentIds,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default NewsService;
