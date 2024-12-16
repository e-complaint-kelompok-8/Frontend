import React, { useState, useEffect } from "react";
import { cancelComplaint } from "@services/complaintService";
import Swal from "sweetalert2";

const reasons = [
  "Berubah Pikiran",
  "Respon Lambat",
  "Sudah di Tangani",
  "Bukti Tidak Cukup",
  "Kesalahan Input",
  "Data Tidak Valid",
  "Masalah Pribadi",
];

const ProsesCard = ({ complaint }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!complaint) {
    return <p>Data pengaduan tidak ditemukan.</p>;
  }

  const handleSubmit = async () => {
    if (!selected) {
      alert("Silakan pilih alasan pembatalan.");
      return;
    }

    setIsLoading(true);
    try {
      // Ensure that the correct identifier (ID) is used
      await cancelComplaint(
        complaint.id || complaint.complaint_number,
        selected
      );

      // SweetAlert2 success message with page refresh
      Swal.fire({
        icon: "success",
        title: "Pengaduan berhasil dibatalkan!",
        text: "Pengaduan Anda telah dibatalkan dengan sukses.",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload(); // This will refresh the page
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Error canceling complaint:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat membatalkan pengaduan. Silakan coba lagi.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const {
    category,
    title,
    location,
    description,
    photos,
    status,
    complaint_number,
  } = complaint;

  return (
    <>
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl font-bold mb-6">Detail Laporan</h1>
        <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
          <div className="flex items-center">
            <span className="ml-auto px-3 py-1 text-sm bg-orange-100 text-orange-500 rounded-full">
              {status}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Laporan
                </label>
                <div className="border border-green-500 rounded-lg px-4 py-2">
                  {category?.name || "Kategori tidak tersedia"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Laporan
                </label>
                <div className="border border-green-500 rounded-lg px-4 py-2">
                  {title || "Judul tidak tersedia"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lokasi
                </label>
                <div className="border border-green-500 rounded-lg px-4 py-2">
                  {location || "Lokasi tidak tersedia"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  readOnly
                  value={description || "Deskripsi tidak tersedia"}
                  className="w-full border border-green-500 rounded-lg px-4 py-2 whitespace-pre-line"
                ></textarea>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Pengaduan
                </label>
                <div className="border border-green-500 rounded-lg px-4 py-2">
                  {complaint_number || "Nomor tidak tersedia"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bukti Foto
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {photos?.length > 0 ? (
                    photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo.photo_url}
                        alt={`Bukti ${index + 1}`}
                        className="w-full h-28 object-cover rounded-lg border"
                      />
                    ))
                  ) : (
                    <p className="text-gray-500">
                      Tidak ada bukti foto yang disertakan.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={() => setIsOpen(true)}
          >
            Batalkan
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-center mb-4">
                Pilih Alasan Pembatalan
              </h2>
              <div className="space-y-2">
                {reasons.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selected === reason
                        ? "bg-indigo-100 border-indigo-500"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancellationReason"
                      value={reason}
                      checked={selected === reason}
                      onChange={() => setSelected(reason)}
                      className="form-radio text-indigo-600"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-4">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-2 px-4 font-semibold rounded-lg transition-colors ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {isLoading ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProsesCard;
