import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  MessageSquare,
  PieChart,
  Search,
  Settings,
  Users,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Edit,
} from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

import ComplaintService from "@services/ComplaintService";

const Sidebar = ({ className, onClose }) => {
  const location = useLocation();

  const isActivePath = (path) => {
    switch (path) {
      case "/admin/complaints":
        return location.pathname.startsWith("/admin/complaint");
      case "/admin/public-services":
        return location.pathname.startsWith("/admin/news");
      default:
        return location.pathname === path;
    }
  };

  return (
    <div
      className={`bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 text-white p-4 md:p-6 space-y-6 h-full flex flex-col ${className} transition-colors duration-300`}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Laporin</h1>
        {onClose && (
          <button onClick={onClose} className="md:hidden">
            <X size={24} />
          </button>
        )}
      </div>
      <nav className="space-y-4 flex-grow">
        {[
          { icon: PieChart, label: "Dashboard", path: "/admin/dashboard" },
          {
            icon: MessageSquare,
            label: "Complaint",
            path: "/admin/complaints",
          },
          {
            icon: Users,
            label: "Public Services",
            path: "/admin/public-services",
          },
          { icon: Users, label: "Users", path: "/admin/users" },
        ].map(({ icon: Icon, label, path }) => (
          <Link
            key={label}
            to={path}
            className={`flex items-center space-x-2 py-2 px-2 rounded-lg transition-colors duration-300 ${
              isActivePath(path)
                ? "bg-white text-indigo-700"
                : "text-white hover:bg-indigo-500/95 hover:text-white"
            }`}
          >
            <Icon size={20} />
            <span className="text-sm md:text-base">{label}</span>
          </Link>
        ))}
      </nav>
      <div>
        <a
          href="#"
          className="flex items-center space-x-2 text-white hover:bg-indigo-500/70 hover:text-white py-2 px-2 rounded-lg transition-colors duration-300"
        >
          <LogOut size={20} />
          <span className="text-sm md:text-base">Log-Out</span>
        </a>
      </div>
    </div>
  );
};

const BottomNavigation = () => {
  const location = useLocation();

  const isActivePath = (path) => {
    switch (path) {
      case "/admin/complaints":
        return location.pathname.startsWith("/admin/complaint");
      case "/admin/public-services":
        return location.pathname.startsWith("/admin/news");
      default:
        return location.pathname === path;
    }
  };

  const navItems = [
    { icon: PieChart, label: "Dashboard", path: "/admin/dashboard" },
    { icon: MessageSquare, label: "Complaint", path: "/admin/complaints" },
    { icon: Users, label: "Services", path: "/admin/public-services" },
    { icon: User, label: "Users", path: "/admin/users" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:block lg:hidden">
      <div className="flex justify-around py-2">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={label}
            to={path}
            className={`flex flex-col items-center py-1 px-2 rounded-lg ${
              isActivePath(path)
                ? "text-indigo-700"
                : "text-gray-500 hover:text-indigo-700"
            }`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const Header = () => {
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const recentComplaints = [
    {
      id: 1,
      sender: "John Doe",
      title: "Jalanan Bolong",
      status: "Belum Ditangani",
    },
    {
      id: 2,
      sender: "Jane Smith",
      title: "Macet Di Tol Cikupa",
      status: "Belum Ditangani",
    },
    {
      id: 3,
      sender: "Alex Johnson",
      title: "Keluhan Produk",
      status: "Belum Ditangani",
    },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotificationDropdown(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    navigate("/edit-profile");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Search Section */}
          <div className="flex items-center flex-1">
            <div className={`flex items-center w-full max-w-md relative`}>
              <Search className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Cari Disini"
                className="w-full pl-10 pr-4 py-2 mr-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Notification and Profile Section */}
          <div className="flex items-center space-x-4 ">
            {/* Notification Dropdown */}
            <div className="relative mt-2" ref={notificationRef}>
              <button
                className="relative"
                onClick={() =>
                  setShowNotificationDropdown(!showNotificationDropdown)
                }
              >
                <Bell className="h-6 w-6 text-gray-400" />
                {/* {recentComplaints.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 transform translate-x-1/2 -translate-y-1/2"></span>
                )} */}
              </button>

              {showNotificationDropdown && (
                <div
                  className="fixed md:absolute top-16 md:top-auto right-4 md:right-0 md:mt-4
          w-[calc(100%-2rem)] md:w-96
          bg-white border-none rounded-lg shadow-2xl
          z-50
          md:before:content-[''] md:before:absolute md:before:border-l-8 md:before:border-r-8 md:before:border-b-8
          md:before:border-l-transparent md:before:border-r-transparent md:before:border-b-white
          md:before:-top-2 md:before:right-2 md:before:rotate-180 mt-1"
                >
                  <div className="p-4 bg-white rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold">
                        Komplain Terbaru
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {/* {recentComplaints.map((complaint) => (
                        <div
                          key={complaint.id}
                          className="py-3 border-b last:border-b-0 flex items-center hover:bg-gray-50 cursor-pointer rounded-lg transition-colors duration-200"
                        >
                          <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                            {complaint.senderAvatar ? (
                              <img
                                src={complaint.senderAvatar}
                                alt={complaint.sender}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-600 text-lg">
                                {complaint.sender.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="ml-3 flex-grow">
                            <p className="text-sm font-medium text-gray-800">
                              {complaint.sender} Baru Saja Complaint
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-48">
                              {complaint.title}
                            </p>
                          </div>
                        </div>
                      ))} */}
                    </div>
                    {/* {recentComplaints.length > 0 && (
                      <div className="mt-3 text-center">
                        <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                          Lihat Semua Komplain
                        </button>
                      </div>
                    )} */}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Section */}
            <div className="relative" ref={profileRef}>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">Halo ! Adam</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronRight
                  size={20}
                  className={`transition-transform duration-300 ${
                    showProfileDropdown ? "rotate-90" : ""
                  }`}
                />
              </div>

              {showProfileDropdown && (
                <div
                  className="fixed md:absolute top-16 md:top-auto right-4 md:right-0 md:mt-4
                w-[calc(50%-2rem)] md:w-48
                bg-white border-none rounded-lg shadow-2xl
                z-50
                md:before:content-[''] md:before:absolute md:before:border-l-8 md:before:border-r-8 md:before:border-b-8
                md:before:border-l-transparent md:before:border-r-transparent md:before:border-b-white
                md:before:-top-2 md:before:right-2 md:before:rotate-180 mt-1"
                >
                  <div className="py-1 bg-white rounded-lg shadow-lg">
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Edit className="h-5 w-5 text-gray-500" />
                      <span>Edit Profil</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2">
                      <LogOut className="h-5 w-5 text-red-600" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const ComplaintForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [complaint, setComplaint] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
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
                  <div className="flex justify-end">
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
                  <div className="flex justify-end">
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
