import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Landmark } from "lucide-react";
import {
  fetchComplaints,
  fetchComplaintsByCategory,
} from "@services/complaintService";

const statusButtons = [
  { label: "Terselesaikan", status: "selesai" },
  { label: "Ditanggapi", status: "tanggapi" },
  { label: "Diproses", status: "proses" },
  { label: "Dibatalkan", status: "batal" },
];

const categoryButtons = [
  { label: "Infrastruktur", id: 1 },
  { label: "Transportasi", id: 2 },
  { label: "Kesehatan", id: 3 },
  { label: "Lingkungan", id: 4 },
  { label: "Keamanan", id: 5 },
  { label: "Pendidikan", id: 6 },
  // Tambahkan kategori lain jika perlu
];

const HistoryPengaduan = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchFilteredComplaints = async () => {
    setLoading(true);
    try {
      const data = await fetchComplaints(selectedStatus, selectedCategory);
      setComplaints(data);
    } catch (error) {
      console.error("Error fetching filtered complaints:", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredComplaints();
  }, [selectedStatus, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <main className=" w-full max-w-[1440px] px-12 py-8">
        <h2 className="text-2xl font-bold mb-8">Riwayat Pengaduan</h2>
        <div className="w-full">
          {/* Dropdown Status */}
          <div className="flex gap-x-4 justify-start mb-4">
            <div className="mb-4">
              <h2 className="font-semibold mb-2 text-base">Status Laporan</h2>
              <select
                className="px-4 py-2 md:w-80 h-12 rounded-lg text-sm border-gray-300 bg-white text-gray-500"
                onChange={(e) => setSelectedStatus(e.target.value || null)}
                value={selectedStatus || ""}
              >
                <option value="">Semua Status</option>
                {statusButtons.map((button) => (
                  <option key={button.status} value={button.status}>
                    {button.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown Kategori */}
            <div className="mb-4">
              <h2 className="font-semibold mb-2 text-base">Kategori Laporan</h2>
              <select
                className="px-4 py-2 md:w-80 h-12 rounded-lg text-sm border-gray-300 bg-white text-gray-500"
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                value={selectedCategory || ""}
              >
                <option value="">Semua Kategori</option>
                {categoryButtons.map((button) => (
                  <option key={button.id} value={button.id}>
                    {button.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Daftar Pengaduan */}
          {!loading && complaints.length > 0 ? (
            <>
              {/* Tampilan Desktop */}
              <div className="hidden lg:block space-y-4">
                {complaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    onClick={() =>
                      navigate(`/user/status-pengaduan/detail/${complaint.id}`)
                    }
                    className="bg-white shadow-md rounded-2xl p-6 flex justify-between items-start gap-x-4 cursor-pointer"
                  >
                    <div className="bg-slate-100 rounded-full p-3 flex items-center justify-center text-slate-400 self-center">
                      <Landmark size={40} />
                    </div>
                    <div className="w-10/12">
                      {/* Baris header dengan "Dari Tim Dukungan" dan kategori */}
                      <h3 className="font-semibold flex items-center gap-2">
                        Dari Tim Dukungan
                        <span className="text-gray-400 text-xs">•</span>{" "}
                        {/* Pemisah dengan titik */}
                        <span className="text-gray-400 text-xs">
                          {complaint.category.name}
                        </span>{" "}
                        {/* Nama kategori */}
                      </h3>

                      {/* Pesan */}
                      <p className="text-gray-600 text-sm mt-1">
                        "Terima kasih telah melaporkan {complaint.title} melalui
                        pusat pengaduan. Kami ingin menginformasikan bahwa
                        laporan Anda telah {complaint.status}."
                      </p>
                    </div>
                    <div className="flex flex-col justify-start">
                      <span
                        className={`text-white px-4 py-1 rounded-lg text-sm font-semibold text-center w-24 ${
                          complaint.status.toLowerCase() === "selesai"
                            ? "bg-green-500"
                            : complaint.status.toLowerCase() === "tanggapi"
                            ? "bg-blue-500"
                            : complaint.status.toLowerCase() === "proses"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tampilan Mobile */}
              <div className="block lg:hidden space-y-4">
                {complaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    onClick={() =>
                      navigate(`/user/status-pengaduan/detail/${complaint.id}`)
                    }
                    className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-4 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="bg-slate-100 rounded-full p-3 flex items-center justify-center text-slate-400">
                        <Landmark size={40} />
                      </div>
                      <span
                        className={`text-white px-4 py-1 rounded-lg text-sm font-semibold text-center ${
                          complaint.status.toLowerCase() === "selesai"
                            ? "bg-green-500"
                            : complaint.status.toLowerCase() === "tanggapi"
                            ? "bg-blue-500"
                            : complaint.status.toLowerCase() === "proses"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Dari Tim Dukungan</h3>
                      <p className="text-sm font-medium text-gray-600">
                        {complaint.category.name}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        "Terima kasih telah melaporkan {complaint.title} melalui
                        pusat pengaduan. Kami ingin menginformasikan bahwa
                        laporan Anda telah {complaint.status}."
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            !loading && <p className="text-center">Tidak ada data tersedia.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default HistoryPengaduan;
