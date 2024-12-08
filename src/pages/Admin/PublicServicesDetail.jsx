import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  MessageSquare,
  PieChart,
  Search,
  Users,
  User,
  X,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useLocation, Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Sidebar = ({ className, onClose }) => {
  const location = useLocation();

  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === path;
    }

    if (path === "/users") {
      return location.pathname.startsWith("/user");
    }
    if (path === "/public-services" && location.pathname.startsWith("/news")) {
      return true;
    }
    return location.pathname.startsWith(path);
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
          { icon: MessageSquare, label: "Complaint", path: "/admin/complaint" },
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
    if (path === "/") {
      return location.pathname === path;
    }
    if (path === "/users") {
      return location.pathname.startsWith("/user");
    }
    if (path === "/public-services" && location.pathname.startsWith("/news")) {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { icon: PieChart, label: "Dashboard", path: "/admin/dashboard" },
    { icon: MessageSquare, label: "Complaint", path: "/admin/complaint" },
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

  // Mock data dengan nama pengirim
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
                {recentComplaints.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 transform translate-x-1/2 -translate-y-1/2"></span>
                )}
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
                      {recentComplaints.map((complaint) => (
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
                      ))}
                    </div>
                    {recentComplaints.length > 0 && (
                      <div className="mt-3 text-center">
                        <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                          Lihat Semua Komplain
                        </button>
                      </div>
                    )}
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

const News = () => {
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [newsImage, setNewsImage] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const commenters = [
    {
      name: "Leo Messi",
      image: "/placeholder.svg?height=48&width=48",
      comment: "Ini akibat masyarakat sering buang sampah sembarangan.",
    },
    {
      name: "Ariska",
      image: "/placeholder.svg?height=48&width=48",
      comment: "Pemerintah harus bertindak tegas dalam menangani hal ini.",
    },
  ];

  const NewsSchema = Yup.object().shape({
    title: Yup.string()
      .min(5, "Judul terlalu pendek")
      .required("Judul wajib diisi"),
    category: Yup.string().required("Kategori wajib dipilih"),
    date: Yup.date().required("Tanggal wajib diisi"),
    content: Yup.string()
      .min(20, "Konten minimal 20 karakter")
      .required("Konten wajib diisi"),
  });

  const initialValues = {
    title: "Pemerintah Meningkatkan Ketangguhan Bencana Alam",
    category: "Lingkungan",
    date: "2024-11-20",
    content:
      "Pemerintah Indonesia telah mengumumkan serangkaian langkah penanggulangan bencana...",
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setNewsImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle navigation back to previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen lg:px-4 md:p-0">
      <div className="mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="mr-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          <span className="text-xs sm:text-sm md:text-base">Kembali</span>
        </button>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={NewsSchema}
        onSubmit={(values) => {
          console.log("Updated news:", values);
        }}
      >
        {({ touched, errors, setFieldValue }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="w-full h-48 sm:h-56 md:h-64 lg:h-72 bg-gray-200 rounded-md flex items-center justify-center cursor-pointer overflow-hidden relative"
                >
                  {newsImage ? (
                    <img
                      src={newsImage}
                      alt="Berita"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm sm:text-base md:text-lg">
                      Klik untuk ganti gambar
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    handleImageChange(e);
                    setFieldValue("newsImage", e.target.files[0]);
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                {/* Judul */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-xs sm:text-sm md:text-base font-bold text-gray-700"
                  >
                    Judul
                  </label>
                  <Field
                    type="text"
                    name="title"
                    className={`w-full rounded-lg p-2 sm:p-3 text-xs sm:text-sm md:text-base border ${
                      errors.title && touched.title
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-xs sm:text-sm mt-1"
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-xs sm:text-sm md:text-base font-bold text-gray-700"
                  >
                    Kategori
                  </label>
                  <Field
                    as="select"
                    name="category"
                    className={`w-full rounded-lg p-2 sm:p-3 text-xs sm:text-sm md:text-base border ${
                      errors.category && touched.category
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Tranportasi">Tranportasi</option>
                    <option value="Infrastruktur">Infrastruktur</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Kemanan">Keamanan</option>
                    <option value="Linkungan">Lingkungan</option>
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-red-500 text-xs sm:text-sm mt-1"
                  />
                </div>

                {/* Tanggal */}
                <div>
                  <label
                    htmlFor="date"
                    className="block text-xs sm:text-sm md:text-base font-bold text-gray-700"
                  >
                    Tanggal
                  </label>
                  <Field
                    type="date"
                    name="date"
                    className={`w-full rounded-lg p-2 sm:p-3 text-xs sm:text-sm md:text-base border ${
                      errors.date && touched.date
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage
                    name="date"
                    component="div"
                    className="text-red-500 text-xs sm:text-sm mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Konten */}
            <div>
              <label
                htmlFor="content"
                className="block text-xs sm:text-sm md:text-base font-bold text-gray-700"
              >
                Konten
              </label>
              <Field
                as="textarea"
                name="content"
                rows="5"
                className={`w-full rounded-lg p-2 sm:p-3 text-xs sm:text-sm md:text-base border ${
                  errors.content && touched.content
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              <ErrorMessage
                name="content"
                component="div"
                className="text-red-500 text-xs sm:text-sm mt-1"
              />
            </div>

            {/* Tombol Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center justify-center text-xs sm:text-sm md:text-base bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg mb-1"
              >
                Update Berita
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {/* Komentar */}
      <div className="col-span-full mt-6 p-4 bg-white rounded-md">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
        >
          <h2 className="text-base sm:text-lg md:text-xl font-bold">
            Komentar
          </h2>
          <ChevronRight
            className={`transition-transform duration-300 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
              isCommentsExpanded ? "rotate-90" : ""
            }`}
          />
        </div>

        {isCommentsExpanded && (
          <div className="space-y-3 mt-4">
            {commenters.map((commenter, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                {/* Gambar */}
                <div className="bg-gray-300 w-8 h-8 sm:w-10 sm:h-10 rounded-full"></div>

                {/* Konten Komentar */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base">
                    {commenter.name}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                    {commenter.comment}
                  </p>
                </div>

                {/* Tombol Hapus */}
                <button
                  onClick={() => handleDeleteComment(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mr-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function PublicServicesDetail() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 pb-16 md:pb-16 lg:pb-0">
      {/* Persistent Sidebar for Large Screens */}
      <Sidebar className="hidden lg:block w-64 fixed h-full" />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
            <News />
          </div>
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
}
