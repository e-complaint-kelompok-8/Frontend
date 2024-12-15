import axiosInstance from "@config/axiosConfig";
import CloudinaryService from "@services/CloudinaryService";

const AdminService = {
  getProfile: async () => {
    try {
      const response = await axiosInstance.get("/profile");
      return response.data.admin;
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      let imageData = null;
      // Jika ada gambar baru
      if (profileData.new_image instanceof File) {
        console.log("Gambar Baru", profileData.new_image);
        console.log("Gambar Lama", profileData.old_photo_url);

        try {
          // Hapus gambar lama terlebih dahulu jika ada
          if (profileData.old_photo_url) {
            const urlParts = profileData.old_photo_url.split("/");
            const publicId = `capstone-altera/${
              urlParts[urlParts.length - 1].split(".")[0]
            }`;
            await CloudinaryService.deleteImage(publicId);
          }

          // Upload gambar baru
          imageData = await CloudinaryService.uploadImage(
            profileData.new_image
          );

          // Tambahkan URL gambar baru ke formData
        } catch (error) {
          console.error("Error handling image:", error);
          throw new Error("Gagal mengelola gambar");
        }
      }

      const updatedData = {
        email: profileData.email,
        password: profileData.password,
        photo: imageData ? imageData.url : profileData.photo,
      };

      const response = await axiosInstance.put("/profile", updatedData);

      return response.data.admin;
    } catch (error) {
      console.error("Error updating admin profile:", error);
      throw error;
    }
  },
};

export default AdminService;
