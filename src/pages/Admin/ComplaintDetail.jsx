import React, { useState, useRef, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import ReactMarkdown from "react-markdown";

import ComplaintService from "@services/Admin/ComplaintService";
import ChatbotService from "@services/Admin/ChatBot";

import Header from "@components/Admin/Header";
import Sidebar from "@components/Admin/Sidebar";
import BottomNavigation from "@components/Admin/BottomNavigation";

const Chatbot = ({ toggleChatbot, complaintId }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Load initial suggestions and previous chat history
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Fetch previous suggestions
        const suggestionsResponse = await ChatbotService.getSuggestions(
          complaintId
        );
        const suggestions = suggestionsResponse.data || [];

        // Fetch previous chat history
        const historyResponse = await ChatbotService.getChatHistory(
          complaintId
        );
        const previousChats = historyResponse.data || [];

        // Combine and sort the chat history
        const combinedHistory = [...suggestions, ...previousChats]
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .map((item) => ({
            sender: item.sender || "admin",
            text: item.text || item.response,
            timestamp: item.createdAt,
          }));

        setChatHistory(combinedHistory);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, [complaintId]);

  // Auto-scroll to the bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: "admin",
      text: message,
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await ChatbotService.addSuggestion(complaintId, message);
      console.log("Full API Response:", response); // Debug log

      // Pastikan struktur response benar
      const botMessage = {
        sender: "bot",
        text: response?.data.response || "Tidak ada respon",
        timestamp: new Date().toISOString(),
      };

      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setMessage("");
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render chat message
  const renderChatMessage = (chat, index) => {
    const isBot = chat.sender === "bot";
    const isAdmin = chat.sender === "admin";
    const isSystem = chat.sender === "system";

    // Kelas dasar untuk pesan
    let messageClasses = "p-3 rounded-lg shadow-md break-words relative";

    // Penyesuaian warna berdasarkan pengirim
    if (isBot) messageClasses += " bg-gray-200 text-gray-800";
    if (isAdmin) messageClasses += " bg-indigo-600 text-white";
    if (isSystem) messageClasses += " bg-yellow-100 text-yellow-800";

    return (
      <div
        key={index}
        className={`flex ${
          isBot || isSystem ? "justify-start" : "justify-end"
        } mb-3`}
      >
        <div
          className={`${messageClasses} ${isBot || isSystem ? "ml-2" : "mr-2"}`}
          style={{
            maxWidth: "80%", // Pesan maksimal 80% dari lebar chatbot
            wordWrap: "break-word", // Memastikan teks panjang tidak meluber
          }}
        >
          <ReactMarkdown
            className="text-sm"
            components={
              isBot || isSystem
                ? {
                    p: ({ node, children }) => (
                      <p style={{ marginBottom: "1rem" }}>{children}</p>
                    ), // Jarak antar paragraf hanya untuk bot atau sistem
                  }
                : undefined // Tidak ada perubahan untuk pesan pengguna
            }
          >
            {typeof chat.text === "string"
              ? chat.text
                  .replace(/^"|"$/g, "") // Menghilangkan tanda " di awal dan akhir
                  .replace(/\\u0026/g, "&") // Mengganti \u0026 dengan &
                  .replace(/\\n/g, "\n") // Mengganti \n dengan newline
              : ""}
          </ReactMarkdown>
          <div
            className={`absolute w-0 h-full border-l-8 border-l-transparent border-r-8 border-r-transparent ${
              isBot || isSystem
                ? "border-b-8 border-b-gray-200 left-0"
                : "border-b-8 border-b-indigo-600 right-0"
            }`}
            style={{
              top: "0", // Posisi ekor di bagian paling atas
              transform:
                isBot || isSystem ? "translateX(-50%)" : "translateX(50%)",
            }}
          ></div>
        </div>
      </div>
    );
  };

  // Render for both mobile and desktop
  return (
    <>
      {/* Mobile View */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 md:hidden">
        <div className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden relative">
          <header className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 flex items-center gap-2">
            {/* <div className="bg-white p-1 rounded-lg w-10 h-10 flex items-center justify-center">
              <img
                src="/placeholder.svg?height=32&width=32"
                alt="Lapi"
                className="w-8 h-8"
              />
            </div> */}
            <div className="text-white flex-1">
              <h1 className="text-base font-semibold">Jarvis</h1>
              <p className="text-xs opacity-90">Chat Bot</p>
            </div>
            <button
              onClick={toggleChatbot}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          <div
            ref={chatContainerRef}
            className="overflow-y-auto bg-gray-50 h-[400px] p-2"
          >
            {chatHistory.map(renderChatMessage)}
            {isLoading && (
              <div className="relative flex justify-start mb-2">
                <div className="relative p-3 bg-gray-200 rounded-lg">
                  <span className="text-sm text-gray-600">Mengetik...</span>

                  {/* Tambahkan ekor di sini */}
                  <div
                    className={`absolute w-0 h-full border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-gray-200 left-0`}
                    style={{
                      top: "0", // Posisi ekor di bagian paling atas
                      transform: "translateX(-50%)",
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          <div className="p-2 bg-white border-t">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
              <input
                type="text"
                placeholder="Tuliskan Pesan Anda"
                className="flex-1 bg-transparent outline-none text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                className="bg-indigo-600 p-2 rounded-lg"
                disabled={isLoading || !message.trim()}
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View - Similar structure to mobile view */}
      <div className="fixed bottom-4 right-4 w-full max-w-sm md:max-w-md lg:max-w-lg bg-white shadow-lg rounded-lg p-2 hidden md:block">
        <header className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 flex items-center gap-2 rounded-t-lg">
          {/* <div className="bg-white p-1 rounded-lg w-10 h-10 flex items-center justify-center">
            <img
              src="/placeholder.svg?height=32&width=32"
              alt="Lapi"
              className="w-8 h-8"
            />
          </div> */}
          <div className="text-white flex-1">
            <h1 className="text-base font-semibold">Jarvis</h1>
            <p className="text-xs opacity-90">Chat Bot</p>
          </div>
          <button
            onClick={toggleChatbot}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div
          ref={chatContainerRef}
          className="overflow-y-auto bg-gray-50 h-[400px] p-2"
        >
          {chatHistory.map(renderChatMessage)}
          {isLoading && (
            <div className="relative flex justify-start mb-2 ml-2">
              <div className="relative p-3 bg-gray-200 rounded-lg">
                <span className="text-sm text-gray-600">Mengetik...</span>

                {/* Tambahkan ekor di sini */}
                <div
                  className={`absolute w-0 h-full border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-gray-200 left-0`}
                  style={{
                    top: "0", // Posisi ekor di bagian paling atas
                    transform: "translateX(-50%)",
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-2 bg-white border-t">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
            <input
              type="text"
              placeholder="Tuliskan Pesan Anda"
              className="flex-1 bg-transparent outline-none text-sm"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              className="bg-indigo-600 p-2 rounded-lg"
              disabled={isLoading || !message.trim()}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ComplaintFormSkeleton = () => {
  return (
    <div className="min-h-screen lg:px-4 md:p-0 pb-24 md:pb-6">
      {/* Back button skeleton */}
      <div className="mb-6">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
          <div className="w-20 h-5 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-start mb-4 md:mb-6">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full animate-pulse"></div>
            <div>
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        {/* Complaint details skeleton */}
        <div className="mb-4">
          <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Image gallery skeleton */}
        <div className="mb-8">
          <div className="hidden md:grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
          <div className="md:hidden aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Feedback section skeleton */}
        <div className="border-t pt-4 md:pt-6">
          <div className="w-24 h-5 bg-gray-200 rounded animate-pulse mb-3 md:mb-4"></div>
          <div className="w-full h-32 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
          <div className="flex space-x-4">
            <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Feedback history skeleton */}
        <div className="mt-6">
          <div className="w-40 h-5 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="space-y-4">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="w-1/3 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

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
      console.log(response.complaint);
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
      // Cek status complaint
      if (complaint?.status?.toLowerCase() === "tanggapi") {
        // Update feedback yang sudah ada
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
        // Tambah feedback baru
        await ComplaintService.addFeedback(id, values.content);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Tanggapan berhasil dikirim",
          timer: 1500,
          showConfirmButton: false,
        });

        resetForm(); // Reset form hanya untuk feedback baru
      }

      fetchComplaintDetail(); // Refresh data
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

  if (loading) {
    return <ComplaintFormSkeleton />;
  }

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
            {/* Mobile Slider */}
            <div className="md:hidden relative">
              <div className="aspect-square rounded-lg overflow-hidden relative">
                {complaint.photos.map((photo, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
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

            {/* Desktop/Tablet Grid Display */}
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
              <p>{complaint?.reason || "Tidak ada alasan yang dicantumkan"}</p>
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
                        e.preventDefault(); // Mencegah form submit
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
                    <p className="text-sm text-gray-600">{feedback.content}</p>
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

      {showChatbot && (
        <Chatbot toggleChatbot={toggleChatbot} complaintId={id} />
      )}
    </div>
  );
};

// Main Complaint Detail Component
export default function ComplaintDetail() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar className="hidden lg:block w-64 fixed h-full" />
      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <Header />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
            <ComplaintForm />
          </div>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}
