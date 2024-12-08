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

const PublicNews = () => {
  const navigate = useNavigate();
  const [categories] = useState([
    { id: 1, name: "Pendidikan" },
    { id: 2, name: "Infrastruktur" },
    { id: 3, name: "Lingkungan" },
    { id: 4, name: "Kesehatan" },
    { id: 5, name: "Sosial" },
  ]);
  const [newsData, setNewsData] = useState([
    {
      id: 1,
      image: null,
      title: "Edukasi Lingkungan Sejak Dini",
      date: "2024-08-27",
      category: 3,
      content:
        "Universitas Indonesia melaksanakan program edukasi kepada siswa sekolah dasar untuk meningkatkan kesadaran mencintai lingkungan.",
    },
    {
      id: 2,
      image: null,
      title: "Trafo PLN untuk Warga Bogor",
      date: "2024-01-30",
      category: 5,
      content:
        "Berkat aspirasi warga saat reses, masyarakat Cikaret, Bogor, kini memiliki trafo PLN yang memberikan peningkatan akses listrik lebih merata.",
    },
    {
      id: 3,
      image: null,
      title: "Peningkatan Ketangguhan Bencana",
      date: "2024-02-09",
      category: 1,
      content:
        "Pemerintah menggalakkan program pelatihan kesiapsiagaan penting megathrust, fokus pada kesiapan dan kesejahteraan.",
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [selectedNews, setSelectedNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);

  const filteredNewsData = useMemo(() => {
    return newsData.filter((news) =>
      news.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [newsData, searchTerm]);

  const NewsSchema = Yup.object().shape({
    title: Yup.string()
      .min(5, "Judul terlalu pendek!")
      .max(100, "Judul terlalu panjang!")
      .required("Judul wajib diisi"),
    date: Yup.date()
      .required("Tanggal wajib diisi")
      .max(new Date(), "Tanggal tidak boleh di masa depan"),
    content: Yup.string()
      .min(20, "Konten terlalu pendek!")
      .max(500, "Konten terlalu panjang!")
      .required("Konten wajib diisi"),
    category: Yup.string() // Ubah menjadi string karena value select adalah string
      .required("Kategori wajib dipilih")
      .nullable(), // Tambahkan nullable() untuk handle nilai kosong
    image: Yup.mixed()
      .required("Gambar tidak boleh kosong") // Ubah pesan error
      .test("fileSize", "Ukuran file terlalu besar", (value) => {
        return !value || value.size <= 5 * 1024 * 1024;
      })
      .test("fileType", "Format file tidak valid", (value) => {
        return (
          !value ||
          ["image/jpeg", "image/png", "image/gif"].includes(value.type)
        );
      }),
  });

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setFieldValue("image", file);
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

  const handleAddNews = (values, { resetForm }) => {
    const newNewsItem = {
      id: newsData.length + 1,
      image: selectedImage || null,
      title: values.title,
      date: values.date,
      content: values.content,
    };

    setNewsData((prev) => [newNewsItem, ...prev]);
    setSelectedImage(null);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleUpdateNews = (values, { resetForm }) => {
    const updatedNewsItem = {
      ...selectedNewsItem,
      image: selectedImage || selectedNewsItem.image,
      title: values.title,
      date: values.date,
      content: values.content,
    };

    setNewsData((prev) =>
      prev.map((item) =>
        item.id === updatedNewsItem.id ? updatedNewsItem : item
      )
    );
    setSelectedImage(null);
    setIsUpdateModalOpen(false);
    resetForm();
  };

  const handleDeleteNews = () => {
    setNewsData((prev) =>
      prev.filter((item) => !selectedNews.includes(item.id))
    );
    setSelectedNews([]);
  };

  const openUpdateModal = (news) => {
    setSelectedNewsItem(news);
    setSelectedImage(news.image);
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
    navigate(`/news/${newsId}`);
  };

  const renderNewsCard = (news) => (
    <div className="rounded-lg md:p-4 mb-4 bg-white shadow-md">
      {/* Image Section - Clickable */}
      <div onClick={() => handleNewsItemClick(news.id)}>
        {news.image ? (
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-40 object-cover rounded-md mb-4"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 rounded-md mb-4"></div>
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
                      handleDeleteNews();
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
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-800">
                {categories.find((c) => c.id === news.category)?.name}
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
              {/* Checkbox Cell */}
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

              {/* Image Cell */}
              <td className="p-4" onClick={() => handleNewsItemClick(news.id)}>
                {news.image ? (
                  <img
                    src={news.image}
                    alt={news.title}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-200 rounded-md"></div>
                )}
              </td>

              {/* Content Cell */}
              <td className="p-4" onClick={() => handleNewsItemClick(news.id)}>
                <div className="text-sm font-medium text-gray-900 line-clamp-2">
                  {news.title}
                </div>
                <div className="text-sm text-gray-500 line-clamp-1">
                  {news.content}
                </div>
              </td>

              {/* Category Cell */}
              <td className="p-4" onClick={() => handleNewsItemClick(news.id)}>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {categories.find((c) => c.id === news.category)?.name}
                </span>
              </td>

              {/* Date Cell */}
              <td
                className="p-4 text-sm text-gray-500"
                onClick={() => handleNewsItemClick(news.id)}
              >
                {new Date(news.date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>

              {/* Actions Cell */}
              <td className="p-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openUpdateModal(news);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 transition-colors"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNews([news.id]);
                      handleDeleteNews();
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
          ...selectedNewsItem,
          image: selectedNewsItem.image || null,
          category: selectedNewsItem.category?.toString() || "",
        }
      : { title: "", date: "", content: "", category: "", image: null };

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
          >
            {({ setFieldValue, errors, touched, resetForm }) => (
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

                {/* Input Fields */}
                {[
                  {
                    name: "title",
                    label: "Judul",
                    type: "text",
                    placeholder: "Masukkan judul berita",
                    icon: <Pencil size={20} className="text-gray-400" />,
                  },
                  {
                    name: "category", // Tambahkan field kategori
                    label: "Kategori",
                    type: "select",
                    icon: <AlignLeft size={20} className="text-gray-400" />,
                    options: categories, // Pastikan categories sudah didefinisikan di state
                  },
                  {
                    name: "date",
                    label: "Tanggal",
                    type: "date",
                    icon: <Calendar size={20} className="text-gray-400" />,
                  },
                  {
                    name: "content",
                    label: "Konten",
                    type: "textarea",
                    placeholder: "Masukkan konten berita",
                    icon: <AlignLeft size={20} className="text-gray-400" />,
                  },
                ].map(({ name, label, type, placeholder, icon, options }) => (
                  <div key={name} className="relative">
                    <label
                      htmlFor={name}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {label}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {icon}
                      </div>
                      {type === "select" ? (
                        <Field
                          as="select"
                          name={name}
                          id={name}
                          className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none 
                            ${
                              touched[name] && errors[name]
                                ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            }`}
                        >
                          <option value="">Pilih Kategori</option>
                          {options.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </Field>
                      ) : (
                        <Field
                          type={type}
                          name={name}
                          id={name}
                          as={type === "textarea" ? "textarea" : "input"}
                          rows={type === "textarea" ? 3 : undefined}
                          placeholder={placeholder}
                          className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none 
                            ${
                              touched[name] && errors[name]
                                ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            }`}
                        />
                      )}
                    </div>
                    <ErrorMessage
                      name={name}
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                ))}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleCloseModal(resetForm, isUpdate)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                  >
                    {isUpdate ? "Perbarui Berita" : "Tambah Berita"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  };

  return (
    <div className="md:max-w-6xl md:mx-auto  md:px-4">
      <div className="flex flex-row justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Berita Terkini</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Plus size={20} className="mr-2" />
          Tambah
        </button>
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

      {renderNewsTable()}

      {/* Modals */}
      {isAddModalOpen && renderModal()}
      {isUpdateModalOpen && renderModal(true)}
    </div>
  );
};

const Pagination = () => (
  <div className="flex items-center justify-center gap-2 mt-6">
    <button className="hidden md:inline px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
      « Previous
    </button>
    <button className="md:hidden px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
      «
    </button>

    {[1, 2, 3].map((page) => (
      <button
        key={page}
        className={`px-3 py-1 rounded ${
          page === 1
            ? "bg-[#4338CA] text-white"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        {page}
      </button>
    ))}
    <span className="px-2">...</span>
    <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
      10
    </button>
    <button className="md:hidden px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
      »
    </button>
    <button className="hidden md:inline px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
      Next »
    </button>
  </div>
);

export default function PublicServices() {
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
            <PublicNews />
            <Pagination />
          </div>
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
}
