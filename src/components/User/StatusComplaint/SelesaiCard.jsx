import React from "react";
// import { Landmark } from "react-icons/fa"; // Pastikan ikon tersedia
import { Bell, ChevronDown, Search, Landmark } from "lucide-react";
import PropTypes from "prop-types";

const SelesaiCard = ({ complaint, feedbackContent }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl md:p-6 p-4 max-w-4xl w-full">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Report Header */}
          <div className="shadow-md rounded-lg p-3.5 mb-4 md:w-3/5 border border-gray-100">
            <div className="flex items-center space-x-4">
              <img
                src={
                  complaint.photos?.[0]?.photo_url ||
                  "https://via.placeholder.com/50"
                }
                alt="Report Thumbnail"
                className="md:w-16 md:h-16 w-12 h-12 object-cover rounded-md"
              />
              <div>
                <p className="text-xs font-bold text-gray-600">
                  Laporan: {complaint.title}
                </p>
                <p className="text-xs font-bold text-gray-600">
                  Nomor Pengaduan: {complaint.complaint_number}
                </p>
                <p className="text-xs font-bold text-gray-600">
                  Tanggal Pengaduan: {formatDate(complaint.created_at)}
                </p>
                <p className="text-xs font-bold text-gray-600">
                  Kategori: {complaint.category?.name || "Tidak ada kategori"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-start justify-between md:justify-start md:items-start md:ml-auto">
            <div className="bg-slate-100 rounded-full p-3 mb-4 flex items-center justify-center text-slate-400 md:hidden">
              <Landmark size={40} /> {/* Ikon untuk mobile */}
            </div>
            <span className="ml-auto md:ml-0 px-3 py-1 text-sm bg-green-100 text-green-500 rounded-full">
              {complaint.status}
            </span>
          </div>
        </div>

        {/* Support Team Response */}
        <div className="flex flex-col md:flex-row items-start gap-y-4 md:gap-x-4">
          <div className="hidden bg-slate-100 rounded-full p-3 md:flex items-center justify-center text-slate-400 self-center">
            <Landmark size={40} /> {/* Gantilah dengan ikon yang sesuai */}
          </div>
          <div className="mb-6 ">
            <h3 className="text-gray-800 font-semibold mb-2">
              Dari Tim Dukungan
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Terima kasih telah melaporkan "{complaint.title}" melalui pusat
              pengaduan.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {complaint.feedbackContent || "Tidak ada tanggapan dari tim."}
            </p>
            <p className="text-gray-700 text-sm font-semibold">
              Salam hangat, <br />
              Tim Dukungan Pengaduan
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

SelesaiCard.propTypes = {
  complaint: PropTypes.shape({
    title: PropTypes.string.isRequired,
    complaint_number: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    category: PropTypes.shape({
      name: PropTypes.string,
    }),
    photos: PropTypes.arrayOf(
      PropTypes.shape({
        photo_url: PropTypes.string,
      })
    ),
  }).isRequired,
  feedbackContent: PropTypes.string.isRequired,
};

export default SelesaiCard;
