import React, { useState } from "react";
import { Landmark, Send } from "lucide-react";
import PropTypes from "prop-types";
import {
  sendFeedbackResponse,
  fetchFeedbackComplaintByComplaintId,
} from "@services/complaintService";
import Swal from "sweetalert2";

const TanggapiCard = ({ complaint }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [sentFeedback, setSentFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseContent, setResponseContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const handleSendResponse = async () => {
    setIsSubmitting(true);
    try {
      // Ambil feedbackId berdasarkan complaintId
      const { feedback } = await fetchFeedbackComplaintByComplaintId(
        complaint.id
      );
      const feedbackId = feedback.id;

      // Kirim respons
      const result = await sendFeedbackResponse(feedbackId, responseContent);
      setSentFeedback(result.data);
      setResponseContent("");
      // SweetAlert2 success message with page refresh
      Swal.fire({
        icon: "success",
        title: "Laporan Anda Telah Selesai!",
        text: "Terima kasih atas partisipasi anda.",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload(); // This will refresh the page
      });
    } catch (error) {
      console.error("Error while sending response:", error);
      alert("Terjadi kesalahan saat mengirim balasan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // Ambil feedbackId berdasarkan complaintId
      const { feedback } = await fetchFeedbackComplaintByComplaintId(
        complaint.id
      );
      const feedbackId = feedback.id;

      // Kirim respons kosong
      await sendFeedbackResponse(feedbackId, "");
      // SweetAlert2 success message with page refresh
      Swal.fire({
        icon: "success",
        title: "Laporan Anda Telah Selesai!",
        text: "Terima kasih atas partisipasi anda.",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload(); // This will refresh the page
      });
    } catch (error) {
      console.error("Error while completing the report:", error);
      alert("Terjadi kesalahan saat menyelesaikan laporan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = () => {
    setShowReplyInput((prev) => !prev);
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl md:p-6 p-4 max-w-4xl w-full">
        <div className="flex flex-col md:flex-row justify-between">
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
              <Landmark size={40} />
            </div>
            <span className="ml-auto md:ml-0 px-3 py-1 text-sm bg-green-100 text-green-500 rounded-full">
              {complaint.status}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-y-4 md:gap-x-4">
          <div className="hidden bg-slate-100 rounded-full m-3 p-3 md:flex items-center justify-center text-slate-400 self-center">
            <Landmark size={40} />
          </div>
          <div className="md:w-10/12">
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
              Salam hangat, <br /> Tim Dukungan Pengaduan
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleReply}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
          >
            {showReplyInput ? "Batal" : "Balas"}
          </button>
        </div>
      </div>

      {showReplyInput && (
        <div className="bg-white shadow-lg rounded-2xl p-4 mt-4">
          <div className="relative flex items-center w-full rounded-lg">
            <input
              value={responseContent}
              onChange={(e) => setResponseContent(e.target.value)}
              type="text"
              disabled={isSubmitting}
              placeholder="Ketikkan Balasan Anda Disini!"
              className="w-full px-4 py-3 border-none text-gray-700 rounded-lg focus:outline-none"
            />
            <button
              onClick={handleSendResponse}
              className="absolute right-2 p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="Submit comment"
              disabled={isSubmitting || !responseContent}
            >
              {isSubmitting ? "Mengirim..." : "Kirim Balasan"}
            </button>
          </div>
        </div>
      )}

      {sentFeedback && (
        <div className="mt-4 bg-slate-100 rounded-xl p-4">
          <h3 className="text-gray-800 font-semibold">Balasan Anda</h3>
          <p className="text-gray-700 text-sm">{sentFeedback.response}</p>
          <p className="text-gray-600 text-xs mt-2">
            Terkirim pada: {formatDate(sentFeedback.created_at)}
          </p>
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={handleComplete}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
        >
          {isSubmitting ? "Memproses..." : "Selesai"}
        </button>
      </div>
    </>
  );
};

TanggapiCard.propTypes = {
  complaint: PropTypes.object.isRequired,
  updateComplaintStatus: PropTypes.func.isRequired,
};

export default TanggapiCard;
