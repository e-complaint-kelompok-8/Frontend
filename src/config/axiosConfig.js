import axios from "axios";
import Swal from "sweetalert2";
import useAuthStore from "@stores/useAuthStore";

// Buat instance axios
const axiosInstance = axios.create({
  baseURL: "https://elaporin.org/admin",
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Mengambil token dari Zustand store
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear auth store
      useAuthStore.getState().clearAuth();

      await Swal.fire({
        icon: "error",
        title: "Sesi Berakhir",
        text: "Sesi Anda telah berakhir. Silakan login kembali.",
        confirmButtonText: "OK",
      });

      // Redirect ke halaman login
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      Swal.fire({
        icon: "error",
        title: "Akses Ditolak",
        text: "Anda tidak memiliki akses ke halaman ini",
      });
    } else if (error.response?.status === 404) {
      Swal.fire({
        icon: "error",
        title: "Data Tidak Ditemukan",
        text: "Data yang Anda cari tidak ditemukan",
      });
    } else if (error.response?.status === 500) {
      Swal.fire({
        icon: "error",
        title: "Kesalahan Server",
        text: "Terjadi kesalahan pada server",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text:
          error.response?.data?.message || "Terjadi kesalahan pada aplikasi",
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
