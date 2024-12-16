import { useState, useEffect } from "react";
import { ImagePlus } from "lucide-react";
import { createComplaint } from "@services/complaintService";
import { fetchUserProfile } from "@services/profileService";
import { useComplaintStore } from "@stores/useComplaintStore";
import { uploadToCloudinary } from "@utils/cloudinary";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useNavigate } from "react-router-dom";

export default function FormSection() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    kategori: "",
    judul: "",
    lokasi: "",
    deskripsi: "",
  });

  const [userName, setUserName] = useState("User");
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for popup
  const [complaintNumber, setComplaintNumber] = useState(""); // Store complaint number
  const addComplaint = useComplaintStore((state) => state.addComplaint);
  const [loading, setLoading] = useState(false); // New state for loading

  useEffect(() => {
    if (showSuccessPopup) {
      // Disable scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scroll when modal is closed
      document.body.style.overflow = "";
    }

    return () => {
      // Cleanup to prevent issues when component unmounts
      document.body.style.overflow = "";
    };
  }, [showSuccessPopup]);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setUserName(profile.name || "User"); // Gunakan nama dari respons, atau default ke "User"
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };

    loadUserProfile();
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!formData.kategori) {
      newErrors.kategori = "Kategori laporan harus dipilih.";
    }

    if (!formData.judul || formData.judul.length < 5) {
      newErrors.judul = "Judul laporan harus diisi dan minimal 5 karakter.";
    }

    if (!formData.lokasi) {
      newErrors.lokasi = "Lokasi kejadian harus diisi.";
    }

    if (!formData.deskripsi || formData.deskripsi.length < 10) {
      newErrors.deskripsi = "Deskripsi harus diisi dan minimal 10 karakter.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for the field being updated
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (files.length + images.length > 3) {
      alert("Maksimal 3 gambar yang dapat diunggah.");
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        alert(`File ${file.name} terlalu besar, maksimal 10MB.`);
        return false;
      }
      return true;
    });

    const newImages = validFiles.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleImageRemove = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      URL.revokeObjectURL(updatedImages[index]); // Membersihkan URL dari memori
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // setLoading(true);

    // Show loading indicator
    Swal.fire({
      title: "Sedang Mengirim Pengaduan",
      text: "Mohon tunggu sebentar",
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
    });

    try {
      // Upload setiap gambar ke Cloudinary
      const uploadedImageUrls = await Promise.all(
        images.map(async (image) => {
          // Konversi kembali URL blob ke file
          const response = await fetch(image);
          const blob = await response.blob();
          const file = new File([blob], "image.jpg", { type: blob.type });

          // Upload ke Cloudinary
          return await uploadToCloudinary(file);
        })
      );

      console.log("Uploaded image URLs:", uploadedImageUrls);

      // Kirim data ke API setelah upload selesai
      const response = await createComplaint({
        category_id: parseInt(formData.kategori, 10),
        complaint_number: `#KES${(Date.now() % 1000000)
          .toString()
          .padStart(6, "0")}`,
        title: formData.judul,
        location: formData.lokasi,
        description: formData.deskripsi,
        photo_urls: uploadedImageUrls,
      });
      setFormData({ kategori: "", judul: "", lokasi: "", deskripsi: "" });
      setImages([]);
      setComplaintNumber(complaintNumber); // Set complaint number
      // Close loading indicator
      Swal.close();
      setShowSuccessPopup(true); // Show success popup
      // window.location.reload();
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim laporan.");
    } finally {
      setLoading(false); // Stop loading after the process
    }
  };

  return (
    <>
      {showSuccessPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowSuccessPopup(false)}
        >
          <div
            className="bg-white rounded-lg shadow-md p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-xl font-semibold tracking-tight">
                  Laporan anda berhasil dikirim!
                </h1>
              </div>

              <div className="flex justify-center">
                <div className="rounded-full border-4 border-indigo-100 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <button
                onClick={() => navigate(`/user/status-pengaduan`)}
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded w-full"
              >
                LIHAT STATUS PENGADUAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full border-t-4 border-blue-600 h-16 w-16"></div>
        </div>
      )}

      {/* Form Section */}
      <div className="mb-12 md:mb-20">
        <h1 className="mb-1 text-2xl font-bold">
          Hallo, Selamat Datang {userName}!
        </h1>
        <p className="text-sm text-gray-600">
          Sampaikan Keluhan Anda Kami Siap Membantu
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-xl bg-white p-6 shadow-sm "
        >
          <div className="  grid gap-8 md:grid-cols-[4fr,3fr]">
            {/* input umum */}
            <div className=" space-y-4">
              <div>
                <label className="mb-2 block text-lg font-medium">
                  Kategori Laporan
                </label>
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  className={`w-full rounded-md border p-2 ${
                    errors.kategori ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Pilih Kategori</option>
                  <option value="1">Infrastruktur</option>
                  <option value="2">Transportasi</option>
                  <option value="3">Kesehatan</option>
                  <option value="4">Lingkungan</option>
                  <option value="5">Keamanan</option>
                  <option value="6">Pendidikan</option>
                </select>
                {errors.kategori && (
                  <p className="text-red-500 text-sm">{errors.kategori}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-lg font-medium">
                  Judul Laporan
                </label>
                <input
                  type="text"
                  name="judul"
                  placeholder="Masukan Judul Laporan Anda"
                  value={formData.judul}
                  onChange={handleChange}
                  className={`w-full rounded-md border p-2 ${
                    errors.judul ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.judul && (
                  <p className="text-red-500 text-sm">{errors.judul}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-lg font-medium">Lokasi</label>
                <input
                  type="text"
                  name="lokasi"
                  placeholder="Lokasi Kejadian"
                  value={formData.lokasi}
                  onChange={handleChange}
                  className={`w-full rounded-md border p-2 ${
                    errors.lokasi ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.lokasi && (
                  <p className="text-red-500 text-sm">{errors.lokasi}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-lg font-medium">
                  Deskripsi
                </label>
                <textarea
                  rows="5"
                  name="deskripsi"
                  placeholder="Deskripsikan laporan anda!"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  className={`w-full rounded-md border p-2 ${
                    errors.deskripsi ? "border-red-500" : "border-gray-300"
                  }`}
                ></textarea>
                {errors.deskripsi && (
                  <p className="text-red-500 text-sm">{errors.deskripsi}</p>
                )}
              </div>
            </div>

            {/* input image */}
            <div>
              <h3 className="mb-2 font-medium">Bukti Foto</h3>
              <div className="rounded-xl h-fit py-8 bg-white shadow">
                <div className="flex max-h-[800px] max-w-[300px] flex-col items-center justify-center gap-3 shadow-md rounded-lg border-2 border-dashed p-6 md:mx-28 mx-auto">
                  <ImagePlus className="h-12 w-12 text-blue-500" />
                  <div className="text-center">
                    <h3 className="text-sm font-medium">
                      Masukan Foto Bukti Anda{" "}
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer text-blue-500 hover:underline"
                      >
                        browse
                      </label>
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Maximum size: 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 px-6">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="rounded-lg"
                      />
                      <button
                        type="button"
                        aria-label={`Hapus gambar ${index + 1}`}
                        onClick={() => handleImageRemove(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-center py-auto"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* button submit */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-white hover:bg-purple-700"
            >
              Kirim Laporan
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
