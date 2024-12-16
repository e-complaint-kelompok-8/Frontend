import axios from "axios";

export const uploadToCloudinary = async (file) => {
  const CLOUD_NAME = "dkxmwwmx1"; // Ganti dengan Cloud Name Anda
  const UPLOAD_PRESET = "ecomplaint_images"; // Ganti dengan Upload Preset Anda
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    console.log("Uploading file to Cloudinary:", file);
    const response = await axios.post(url, formData);
    console.log("Cloudinary upload response:", response);
    return response.data.secure_url; // URL gambar yang diupload
  } catch (error) {
    console.error(
      "Cloudinary upload error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
