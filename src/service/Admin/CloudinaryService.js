import axios from "axios";
import sha1 from "crypto-js/sha1";

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

const CloudinaryService = {
  uploadImage: async (imageFile) => {
    if (!imageFile) return null;

    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);
      formData.append("folder", "capstone-altera"); // Pastikan folder konsisten

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
          },
        }
      );

      console.log("Cloudinary Upload Response:", response.data);

      return {
        url: response.data.secure_url,
        publicId: response.data.public_id,
      };
    } catch (error) {
      console.error("Cloudinary Upload Error:", error.response?.data || error);
      throw new Error("Gagal mengupload gambar ke Cloudinary");
    }
  },

  deleteImage: async (publicId) => {
    if (!publicId) return;

    try {
      const timestamp = new Date().getTime();
      const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
      const signature = sha1(stringToSign).toString();

      const formData = new FormData();
      formData.append("public_id", publicId);
      formData.append("signature", signature);
      formData.append("api_key", CLOUDINARY_API_KEY);
      formData.append("timestamp", timestamp.toString());

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
        formData
      );

      console.log("Image deleted from Cloudinary:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting from Cloudinary:", error);
      throw new Error("Gagal menghapus gambar dari Cloudinary");
    }
  },
};

export default CloudinaryService;
