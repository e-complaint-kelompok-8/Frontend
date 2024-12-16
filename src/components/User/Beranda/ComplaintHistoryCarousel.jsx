import React, { useState, useEffect } from "react";
import { fetchUserComplaints } from "@services/complaintService"; // Pastikan path-nya benar
import { useComplaintStore } from "@stores/useComplaintStore";

const ComplaintHistoryCarousel = () => {
  const complaints = useComplaintStore((state) => state.complaints);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slidesPerPage = 2; // Jumlah keluhan per slide
  const maxDescriptionLength = 100; // Panjang maksimal deskripsi

  // Fetch data pengaduan dari API
  useEffect(() => {
    const loadComplaints = async () => {
      try {
        setLoading(true);
        const complaintsData = await fetchUserComplaints();

        // Simpan data ke store
        if (complaintsData && complaintsData.length > 0) {
          useComplaintStore.getState().setComplaints(complaintsData);
        } else {
          setError("Tidak ada data keluhan.");
        }
      } catch (err) {
        console.error("Error fetching complaints:", err);
        setError("Gagal memuat data keluhan. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "selesai":
        return "bg-green-500 text-white";
      case "tanggapi":
        return "bg-blue-500 text-white";
      case "proses":
        return "bg-yellow-500 text-white";
      case "batal":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (loading) {
    return (
      <div className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Riwayat Pengaduan</h2>
        <p className="text-gray-600">Memuat data pengaduan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Riwayat Pengaduan</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const recentComplaints = complaints.slice(0, 4); // Ambil 4 pengaduan terbaru
  const totalSlides = Math.ceil(recentComplaints.length / slidesPerPage);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div className="mb-12 md:mb-20">
      <div className="mb-4 flex items-center justify-center">
        <h2 className="text-xl font-bold">Riwayat Pengaduan</h2>
      </div>
      <div className="relative overflow-hidden p-6">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, pageIndex) => (
            <div
              key={pageIndex}
              className="flex w-full flex-shrink-0 gap-6 px-14"
            >
              {recentComplaints
                .slice(
                  pageIndex * slidesPerPage,
                  pageIndex * slidesPerPage + slidesPerPage
                )
                .map((complaint) => (
                  <div key={complaint.id} className="w-1/2 ">
                    <div className="h-38 h-full overflow-hidden rounded-xl shadow-md bg-white p-6 transition-all duration-300 hover:shadow-lg">
                      <div className="flex justify-between items-center mb-4">
                        {/* <div className="flex items-center"> */}
                        <h3 className="text-gray-700 text-lg font-semibold truncate">
                          {complaint.title}
                        </h3>

                        {/* </div> */}
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-sm ${getStatusColor(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>
                      </div>

                      <div className="flex flex-col items-between">
                        <p className="text-gray-600 text-sm">
                          {complaint.description.length > maxDescriptionLength
                            ? complaint.description.slice(
                                0,
                                maxDescriptionLength
                              ) + "..."
                            : complaint.description}
                        </p>
                        <span className="text-gray-400 text-sm flex justify-end">
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Tombol navigasi */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:bg-gray-100"
          onClick={handlePrev}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:bg-gray-100"
          onClick={handleNext}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Indicator navigasi */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full transition-all ${
              currentSlide === index ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrentSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ComplaintHistoryCarousel;
