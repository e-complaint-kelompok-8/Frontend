import React, { useState, useMemo, useEffect, useRef } from "react";
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
  Plus,
  Calendar,
  FileImage,
  Pencil,
  AlignLeft,
  Trash2,
  Edit,
  ChevronRight,
} from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import NewsService from "@services/NewsService";
import CategoryService from "@services/CategoryService";
import useAuthStore from "@stores/useAuthStore";

const Sidebar = ({ className, onClose }) => {
  const location = useLocation();

  const isActivePath = (path) => {
    switch (path) {
      case "/admin/complaints":
        return location.pathname.startsWith("/admin/complaint");
      case "/admin/public-services":
        location.pathname.startsWith("/admin/news");
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
        location.pathname.startsWith("/admin/news");
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

const PublicNews = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [update, isUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [newsImage, setNewsImage] = useState(null);

  const limit = 10;

  const [newsData, setNewsData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [selectedNews, setSelectedNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getCategories();
        setCategories(response || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal mengambil data kategori",
        });
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await NewsService.getAllNews(currentPage, limit);
      console.log("API Response:", response);

      // Sesuaikan dengan struktur response dari API
      setNewsData(response.news || []); // Sesuaikan dengan response structure
      setTotalPages(response.total_pages || 1);
      setTotalItems(response.total_items || 0);
    } catch (error) {
      console.error("Error fetching news:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal mengambil data",
        text: "Terjadi kesalahan saat mengambil data berita",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [currentPage]);

  const filteredNewsData = useMemo(() => {
    return newsData.filter((news) =>
      news.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [newsData, searchTerm]);

  const renderPagination = () => {
    return (
      <div className="flex items-center justify-center gap-2 mt-6 pb-16 md:pb-8">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 text-sm ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          « Previous
        </button>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-3 py-1 rounded ${
                  pageNumber === currentPage
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {pageNumber}
              </button>
            );
          } else if (
            pageNumber === currentPage - 2 ||
            pageNumber === currentPage + 2
          ) {
            return (
              <span key={pageNumber} className="px-2">
                ...
              </span>
            );
          }
          return null;
        })}

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 text-sm ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Next »
        </button>
      </div>
    );
  };

  const NewsSchema = Yup.object().shape({
    title: Yup.string()
      .min(5, "Judul terlalu pendek!")
      .max(100, "Judul terlalu panjang!")
      .required("Judul wajib diisi"),
    content: Yup.string()
      .min(20, "Konten terlalu pendek!")
      .max(500, "Konten terlalu panjang!")
      .required("Konten wajib diisi"),
    category: Yup.string().required("Kategori wajib dipilih"),
    date: Yup.date()
      .required("Tanggal wajib diisi")
      .max(new Date(), "Tanggal tidak boleh di masa depan"),
    // Hapus required untuk image
    image: Yup.mixed()
      .nullable() // Tambahkan ini
      .test("fileSize", "Ukuran file terlalu besar", (value) => {
        if (!value || typeof value === "string") return true;
        return value.size <= 5 * 1024 * 1024;
      })
      .test("fileType", "Format file tidak valid", (value) => {
        if (!value || typeof value === "string") return true;
        return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      }),
  });

  useEffect(() => {
    if (isUpdateModalOpen && selectedNewsItem) {
      setSelectedImage(selectedNewsItem.photo_url);
    } else {
      setSelectedImage(null);
    }
  }, [isUpdateModalOpen, selectedNewsItem]);

  const handleImageChange = async (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Preview image
        setSelectedImage(URL.createObjectURL(file));
        // Set file untuk upload
        setFieldValue("image", file);
      } catch (error) {
        console.error("Error handling image:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat memproses gambar",
        });
      }
    }
  };

  const handleCloseModal = (resetForm, isUpdate = false) => {
    resetForm();
    setSelectedImage(null);
    setSelectedNewsItem(null);
    if (isUpdate) {
      setIsUpdateModalOpen(false);
    } else {
      setIsAddModalOpen(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const handleAddNews = async (values, { resetForm, setSubmitting }) => {
    try {
      setSubmitting(true);

      const adminId = useAuthStore.getState().getAdminIdFromToken();

      if (!adminId) {
        throw new Error("Invalid admin id");
      }

      await NewsService.createNews({
        admin_id: adminId,
        title: values.title,
        content: values.content,
        category_id: values.category, // Pastikan dalam bentuk integer
        date: formatDate(values.date),
        image: values.image, // Ini akan dihandle di NewsService untuk upload ke Cloudinary
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Berita berhasil ditambahkan",
        timer: 1500,
        showConfirmButton: false,
      });

      setSelectedImage(null);
      setIsAddModalOpen(false);
      resetForm();
      fetchNews();
    } catch (error) {
      console.error("Error adding news:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal menambahkan berita",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateNews = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);

      const adminId = useAuthStore.getState().getAdminIdFromToken();

      if (!adminId) {
        throw new Error("Invalid admin id");
      }

      if (!selectedNewsItem) {
        throw new Error("No news item selected");
      }

      const updateData = {
        admin_id: adminId,
        title: values.title,
        content: values.content,
        category_id: parseInt(values.category),
        date: formatDate(values.date),
        photo_url: selectedNewsItem.photo_url, // Gunakan selectedNewsItem bukan newsData
      };

      // Jika ada file gambar baru
      if (values.image instanceof File) {
        console.log("Updating with new image");
        updateData.new_image = values.image;
        updateData.old_photo_url = selectedNewsItem.photo_url; // Gunakan selectedNewsItem bukan newsData
        console.log("Update data with image:", {
          ...updateData,
          old_photo_url: selectedNewsItem.photo_url,
        });
      }

      await NewsService.updateNews(selectedNewsItem.id, updateData);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Berita berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      });

      // Reset semua state dan tutup modal
      setNewsImage(null);
      setSelectedImage(null);
      setSelectedNewsItem(null);
      setIsUpdateModalOpen(false);
      resetForm();
      fetchNews();
    } catch (error) {
      console.error("Error updating news:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Gagal memperbarui berita",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNews = async (id) => {
    try {
      // Pastikan ada ID yang dipilih
      if (!selectedNews || selectedNews.length === 0) {
        throw new Error("Tidak ada berita yang dipilih");
      }

      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Berita yang dihapus tidak dapat dikembalikan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await NewsService.deleteNews(selectedNews);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Berita berhasil dihapus",
          timer: 1500,
          showConfirmButton: false,
        });

        // Reset semua state terkait
        setSelectedNews([]);
        setActiveDropdown(null); // Tutup dropdown jika ada
        setIsUpdateModalOpen(false); // Tutup modal update jika terbuka
        fetchNews();
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Gagal menghapus berita",
      });
    }
  };

  const openUpdateModal = (news) => {
    console.log("News data for update:", news); // Untuk debugging

    setSelectedNewsItem({
      ...news,
      // Pastikan category memiliki format yang konsisten
      category: {
        id: news.category?.id || news.category_id,
        name: news.category?.name || news.category,
      },
    });

    // Set image preview dari photo_url
    setSelectedImage(news.photo_url);
    setIsUpdateModalOpen(true);
  };

  const handleSelectNews = (id) => {
    setSelectedNews((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAllNews = () => {
    if (selectedNews.length === filteredNewsData.length) {
      setSelectedNews([]);
    } else {
      setSelectedNews(filteredNewsData.map((news) => news.id));
    }
  };

  const handleNewsItemClick = (newsId) => {
    navigate(`/admin/news/${newsId}`);
  };

  const renderNewsCard = (news) => (
    <div className="rounded-lg md:p-4 mb-4 bg-white shadow-md" key={news.id}>
      {/* Image Section - Clickable */}
      <div onClick={() => handleNewsItemClick(news.id)}>
        {news.photo_url ? ( // Ubah dari image_url ke photo_url
          <img
            src={news.photo_url}
            alt={news.title}
            className="w-full h-40 object-cover rounded-md mb-4"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
            <FileImage className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex px-4 space-x-4">
        <div className="flex flex-col space-y-2 flex-1 pb-4 relative">
          {/* Title and Dropdown */}
          <div className="flex items-center justify-between">
            <h3
              className="text-base font-semibold text-gray-900 line-clamp-2 pr-2 cursor-pointer"
              onClick={() => handleNewsItemClick(news.id)}
            >
              {news.title}
            </h3>

            {/* Dropdown Trigger */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setActiveDropdown(
                    activeDropdown === news.id ? null : news.id
                  );
                }}
                className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
              >
                &#8942;
              </button>

              {/* Dropdown Menu */}
              {activeDropdown === news.id && (
                <div className="absolute z-10 right-0 top-[100%] w-48 bg-white border rounded-md shadow-lg">
                  <button
                    onClick={() => {
                      openUpdateModal(news);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setSelectedNews([news.id]);
                      // handleDeleteNews();
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Other content - Clickable */}
          <div
            onClick={() => handleNewsItemClick(news.id)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs mb-4">
              {/* <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-800">
                {categories.find((c) => c.id === parseInt(news.category))?.name}
              </span> */}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-800">
                {news.category.name}
              </span>

              <span>
                {new Date(news.date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <p className="text-sm text-gray-500 line-clamp-2">{news.content}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNewsTable = () => (
    <div className="md:bg-white md:shadow rounded-lg overflow-x-auto">
      {/* Desktop View - Table Layout */}
      <table className="w-full hidden sm:table">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-left">
              <input
                type="checkbox"
                checked={
                  filteredNewsData.length > 0 &&
                  selectedNews.length === filteredNewsData.length
                }
                onChange={(e) => {
                  e.stopPropagation();
                  handleSelectAllNews();
                }}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gambar
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Content
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kategori
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredNewsData.map((news) => (
            <tr
              key={news.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <td className="p-4" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedNews.includes(news.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSelectNews(news.id);
                  }}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
              </td>
              <td className="p-4" onClick={() => handleNewsItemClick(news.id)}>
                {news.photo_url ? ( // Ubah dari image_url ke photo_url
                  <img
                    src={news.photo_url}
                    alt={news.title}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                    <FileImage className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </td>
              <td className="p-4" onClick={() => handleNewsItemClick(news.id)}>
                <div className="text-sm font-medium text-gray-900 line-clamp-2">
                  {news.title}
                </div>
                <div className="text-sm text-gray-500 line-clamp-1">
                  {news.content}
                </div>
              </td>
              <td className="p-4" onClick={() => handleNewsItemClick(news.id)}>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {/* {
                    categories.find((c) => c.id === parseInt(news.category))
                      ?.name
                  } */}
                  {news.category.name}
                </span>
              </td>
              <td
                className="p-4 text-sm text-gray-500"
                onClick={() => handleNewsItemClick(news.id)}
              >
                {new Date(news.date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </td>
              <td className="p-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => openUpdateModal(news)}
                    className="text-indigo-600 hover:text-indigo-900 transition-colors"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedNews([news.id]);
                      // handleDeleteNews();
                    }}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile View - Card Layout */}
      <div className="sm:hidden">{filteredNewsData.map(renderNewsCard)}</div>

      {/* Empty State */}
      {filteredNewsData.length === 0 && (
        <div className="text-center py-10 px-4">
          <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
            <Search size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Tidak ada berita ditemukan
          </h3>
          <p className="text-gray-500 mb-4">
            Coba ubah kata kunci pencarian atau tambahkan berita baru
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Reset Pencarian
          </button>
        </div>
      )}
    </div>
  );
  const renderModal = (isUpdate = false) => {
    const initialValues = isUpdate
      ? {
          title: selectedNewsItem.title,
          content: selectedNewsItem.content,
          category: selectedNewsItem.category.id.toString(),
          date: formatDate(selectedNewsItem.date),
          image: selectedNewsItem.photo_url,
        }
      : {
          title: "",
          content: "",
          category: "",
          date: "",
          image: null,
        };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {isUpdate ? "Perbarui Berita" : "Tambah Berita Baru"}
            </h2>
            <button
              onClick={() => handleCloseModal(() => {}, isUpdate)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={NewsSchema}
            onSubmit={isUpdate ? handleUpdateNews : handleAddNews}
            enableReinitialize
          >
            {({ setFieldValue, errors, touched, resetForm, isSubmitting }) => (
              <Form className="p-6 space-y-5">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Berita
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="relative cursor-pointer">
                      <div className="flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
                        <FileImage size={20} />
                        <span>
                          {selectedImage ? "Ganti Gambar" : "Pilih Gambar"}
                        </span>
                      </div>
                      <input
                        type="file"
                        name="image"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={(event) =>
                          handleImageChange(event, setFieldValue)
                        }
                        className="sr-only"
                      />
                    </label>
                    {selectedImage && (
                      <img
                        src={selectedImage}
                        alt="Preview"
                        className="h-16 w-16 object-cover rounded-md"
                      />
                    )}
                  </div>
                  <ErrorMessage
                    name="image"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Pencil size={20} className="text-gray-400" />
                    </div>
                    <Field
                      type="text"
                      name="title"
                      placeholder="Masukkan judul berita"
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none ${
                        errors.title && touched.title
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      }`}
                    />
                  </div>
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Category Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <div className="relative">
                    <Field
                      as="select"
                      name="category"
                      className={`block w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none ${
                        errors.category && touched.category
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      }`}
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Date Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={20} className="text-gray-400" />
                    </div>
                    <Field
                      type="date"
                      name="date"
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none ${
                        errors.date && touched.date
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      }`}
                    />
                  </div>
                  <ErrorMessage
                    name="date"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Content Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konten
                  </label>
                  <div className="relative">
                    <Field
                      as="textarea"
                      name="content"
                      rows={4}
                      placeholder="Masukkan konten berita"
                      className={`block w-full p-3 border rounded-md focus:outline-none ${
                        errors.content && touched.content
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      }`}
                    />
                  </div>
                  <ErrorMessage
                    name="content"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => handleCloseModal(resetForm, isUpdate)}
                    disabled={isSubmitting}
                    className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium 
                      ${
                        isSubmitting
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-50"
                      } 
                      transition-colors`}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 
                      text-white rounded-md text-sm font-medium relative
                      ${
                        isSubmitting
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:from-indigo-600 hover:to-purple-700"
                      } 
                      transition-all shadow-md hover:shadow-lg min-w-[100px]`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                        <span>Loading...</span>
                      </div>
                    ) : isUpdate ? (
                      "Perbarui"
                    ) : (
                      "Tambah"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  };

  // Main Return
  return (
    <div className="md:max-w-6xl md:mx-auto md:px-4">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Berita Terkini</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Plus size={20} className="mr-2" />
            Tambah
          </button>
        </div>
      </div>
      {/* Bulk Action Area */}
      {selectedNews.length > 0 && (
        <div className="bg-indigo-50 p-4 rounded-lg flex justify-between items-center mb-4">
          <p className="text-indigo-800">
            {selectedNews.length} berita dipilih
          </p>
          <button
            onClick={handleDeleteNews}
            className="flex items-center text-red-600 hover:bg-red-100 px-3 py-2 rounded-md transition-colors"
          >
            <Trash2 size={20} className="mr-2" />
            Hapus Terpilih
          </button>
        </div>
      )}
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {renderNewsTable()}
          {renderPagination()}
        </>
      )}
      {/* Modals */}
      {isAddModalOpen && renderModal(false)} {/* Pass false for add modal */}
      {isUpdateModalOpen && renderModal(true)}{" "}
      {/* Pass true for update modal */}
    </div>
  );
};

export default function PublicServices() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-gray-100 pb-16 md:pb-16 lg:pb-0">
      {/* Persistent Sidebar for Large Screens */}
      <Sidebar className="hidden lg:block w-64 fixed h-full" />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
            <PublicNews />
          </div>
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
}
