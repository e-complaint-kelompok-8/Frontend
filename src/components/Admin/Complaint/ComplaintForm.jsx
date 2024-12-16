// components/Complaint/ComplaintForm.js
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import ComplaintService from "@services/Admin/ComplaintService";

import Chatbot from "./Chatbot";
import ComplaintFormSkeleton from "./ComplaintFormSkeleton";

const ComplaintForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [complaint, setComplaint] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    fetchComplaintDetail();
  }, [id]);

  const fetchComplaintDetail = async () => {
    try {
      setLoading(true);
      const response = await ComplaintService.getComplaintDetail(id);
      setComplaint(response.complaint);
    } catch (error) {
      console.error("Error fetching complaint:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Mengambil Data",
        text: "Terjadi kesalahan saat mengambil detail pengaduan",
      });
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const nextImage = () => {
    if (complaint?.photos?.length) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % complaint.photos.length
      );
    }
  };

  const toggleChatbot = () => {
    setShowChatbot((prev) => !prev);
  };

  const prevImage = () => {
    if (complaint?.photos?.length) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + complaint.photos.length) % complaint.photos.length
      );
    }
  };

  const validationSchema = Yup.object().shape({
    content: Yup.string()
      .required("Tanggapan wajib diisi")
      .min(10, "Tanggapan minimal 10 karakter")
      .max(2000, "Tanggapan maksimal 2000 karakter"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (complaint?.status?.toLowerCase() === "tanggapi") {
        await ComplaintService.updateFeedback(
          complaint.feedback[0].id,
          values.content
        );

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Tanggapan berhasil diperbarui",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await ComplaintService.addFeedback(id, values.content);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Tanggapan berhasil dikirim",
          timer: 1500,
          showConfirmButton: false,
        });

        resetForm();
      }

      fetchComplaintDetail();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal mengirim tanggapan",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "proses":
        return "bg-yellow-100 text-yellow-800";
      case "selesai":
        return "bg-green-100 text-green-800";
      case "batal":
        return "bg-red-100 text-red-800";
      case "tanggapi":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen lg:px-4 md:p-0 pb-24 md:pb-6">
      <div className="mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="mr-2" />
          <span className="text-sm md:text-base">Kembali</span>
        </button>
      </div>

      {loading ? (
        <ComplaintFormSkeleton />
      ) : (
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex justify-between items-start mb-4 md:mb-6">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full overflow-hidden">
                {complaint?.user?.photo_url ? (
                  <img
                    src={complaint.user.photo_url}
                    alt={complaint.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-semibold">
                    {complaint?.user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold">
                  {complaint?.user?.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {complaint?.complaint_number}
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                complaint?.status
              )}`}
            >
              {complaint?.status?.toUpperCase()}
            </span>
          </div>

          <div className="mb-4">
            <h3 className="font-medium text-lg mb-2">{complaint?.title}</h3>
            <p className="text-sm md:text-base text-gray-600">
              {complaint?.description}
            </p>
          </div>

          {complaint?.photos?.length > 0 && (
            <div className="mb-8">
              <div className="md:hidden relative">
                <div className="aspect-square rounded-lg overflow-hidden relative">
                  {complaint.photos.map((photo, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        index === currentImageIndex
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <img
                        src={photo.photo_url}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-2"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-2"
                >
                  <ChevronRight />
                </button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                  {complaint.photos.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex
                          ? "bg-indigo-600"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="hidden md:grid grid-cols-3 gap-4">
                {complaint.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      src={photo.photo_url}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4 md:pt-6">
            <h3 className="font-medium mb-3 md:mb-4 text-sm md:text-base">
              {complaint?.status?.toLowerCase() === "batal"
                ? "Alasan Pembatalan"
                : "Tanggapan"}
            </h3>

            {complaint?.status?.toLowerCase() === "batal" ? (
              <div className="p-4 bg-red-50 rounded-lg text-red-700">
                <p>
                  {complaint?.reason || "Tidak ada alasan yang dicantumkan"}
                </p>
              </div>
            ) : complaint?.status?.toLowerCase() === "selesai" ? (
              <div className="space-y-2">
                <textarea
                  value={complaint?.feedback?.content || ""}
                  readOnly
                  className="w-full p-3 md:p-4 rounded-lg border text-sm md:text-base
                  bg-gray-50 border-gray-300"
                  rows={4}
                />
              </div>
            ) : complaint?.status?.toLowerCase() === "tanggapi" ? (
              <Formik
                initialValues={{
                  content: complaint?.feedback?.[0]?.content || "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-4">
                    <div className="space-y-2">
                      <Field
                        as="textarea"
                        name="content"
                        placeholder="Edit Tanggapan Disini"
                        className={`
              w-full p-3 md:p-4 rounded-lg border text-sm md:text-base
              focus:outline-none focus:ring-2 transition-all duration-300
              ${
                errors.content && touched.content
                  ? "border-red-500 focus:ring-red-500 bg-red-50"
                  : "border-gray-300 focus:ring-indigo-500 hover:border-indigo-500/50"
              }
            `}
                        rows={4}
                      />
                      <ErrorMessage
                        name="content"
                        component="div"
                        className="text-red-500 text-xs md:text-sm mt-1"
                      />
                    </div>
                    <div className="flex justify-start space-x-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 md:px-6 py-2 bg-indigo-600 text-white rounded-lg 
              hover:bg-indigo-700 transition-all duration-300 
              text-sm md:text-base disabled:opacity-50 
              disabled:cursor-not-allowed transform active:scale-95"
                      >
                        {isSubmitting ? "Memperbarui..." : "Update Tanggapan"}
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleChatbot();
                        }}
                        className="px-4 py-2  bg-indigo-600 text-white rounded-lg 
                      hover:bg-indigo-700 transition-all duration-300 
            text-sm md:text-base"
                      >
                        Suggestion
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <Formik
                initialValues={{
                  content: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-4">
                    <div className="space-y-2">
                      <Field
                        as="textarea"
                        name="content"
                        placeholder="Isi Tanggapan Disini"
                        className={`
                        w-full p-3 md:p-4 rounded-lg border text-sm md:text-base
                        focus:outline-none focus:ring-2 transition-all duration-300
                        ${
                          errors.content && touched.content
                            ? "border-red-500 focus:ring-red-500 bg-red-50"
                            : "border-gray-300 focus:ring-indigo-500 hover:border-indigo-500/50"
                        }
                      `}
                        rows={4}
                      />
                      <ErrorMessage
                        name="content"
                        component="div"
                        className="text-red-500 text-xs md:text-sm mt-1"
                      />
                    </div>
                    <div className="flex justify-start space-x-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 md:px-6 py-2 bg-indigo-600 text-white rounded-lg 
                        hover:bg-indigo-700 transition-all duration-300 
                        text-sm md:text-base disabled:opacity-50 
                        disabled:cursor-not-allowed transform active:scale-95"
                      >
                        {isSubmitting ? "Mengirim..." : "Kirim"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleChatbot();
                        }}
                        className="px-4 py-2  bg-indigo-600 text-white rounded-lg 
                      hover:bg-indigo-700 transition-all duration-300 
            text-sm md:text-base"
                      >
                        Suggestion
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}

            {complaint?.feedbacks?.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Riwayat Tanggapan
                </h4>
                <div className="space-y-4">
                  {complaint.feedbacks.map((feedback, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        {feedback.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(feedback.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {showChatbot && (
        <Chatbot toggleChatbot={toggleChatbot} complaintId={id} />
      )}
    </div>
  );
};

export default ComplaintForm;
