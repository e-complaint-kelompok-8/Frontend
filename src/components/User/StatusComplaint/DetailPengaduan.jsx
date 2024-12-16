import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchComplaintById } from "@services/complaintService";
import { fetchFeedbackComplaintByComplaintId } from "@services/complaintService";
import ProsesCard from "@components/User/StatusComplaint/ProsesCard";
import SelesaiCard from "@components/User/StatusComplaint/SelesaiCard";
import TanggapiCard from "@components/User/StatusComplaint/TanggapiCard";
import BatalCard from "@components/User/StatusComplaint/BatalCard";
import { ChevronLeft } from "lucide-react";

const DetailPengaduan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialComplaint = async () => {
      try {
        setLoading(true);
        const initialComplaint = await fetchComplaintById(id);
        setComplaint(initialComplaint);
        setStatus(initialComplaint.status); // Set status untuk menentukan API berikutnya
      } catch (error) {
        console.error("Error fetching initial complaint:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialComplaint();
  }, [id]);

  useEffect(() => {
    if (!status || status === "proses" || status === "batal") return;

    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const feedbackResponse = await fetchFeedbackComplaintByComplaintId(id);
        const { complaint: complaintData, content } =
          feedbackResponse.feedback || {};
        setComplaint({ ...complaintData, feedbackContent: content });
      } catch (error) {
        console.error("Error fetching feedback complaint:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [status, id]);

  if (loading) {
    return (
      <p className="text-center text-gray-500">Memuat detail pengaduan...</p>
    );
  }

  if (!complaint) {
    return (
      <p className="text-center text-gray-500">
        Data pengaduan tidak ditemukan.
      </p>
    );
  }

  const updateComplaintStatus = (newStatus) => {
    setComplaint((prevComplaint) => ({
      ...prevComplaint,
      status: newStatus,
    }));
    setStatus(newStatus); // Update status global
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-[1440px] px-12 mx-auto min-h-screen flex-col items-center">
        <div
          className="flex items-center cursor-pointer pt-6"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft
            size={24}
            className="text-gray-700 hover:text-gray-900"
          />
          <h2 className="text-lg font-medium text-gray-700 hover:text-gray-900">
            Kembali
          </h2>
        </div>
        <main className="flex-col justify-center items-center mx-auto max-w-4xl md:px-4 py-8">
          {complaint.status === "selesai" && (
            <SelesaiCard complaint={complaint} />
          )}
          {complaint.status === "tanggapi" && (
            <TanggapiCard
              complaint={complaint}
              updateComplaintStatus={updateComplaintStatus}
            />
          )}
          {complaint.status === "proses" && (
            <ProsesCard complaint={complaint} />
          )}
          {complaint.status === "batal" && <BatalCard complaint={complaint} />}
          {!["selesai", "tanggapi", "proses", "batal"].includes(
            complaint.status?.toLowerCase()
          ) && (
            <p className="text-center text-gray-500">
              Status pengaduan tidak dikenali.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default DetailPengaduan;
