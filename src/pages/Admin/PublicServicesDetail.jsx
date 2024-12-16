import React, { useState, useEffect, useRef } from "react";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";

import useAuthStore from "@stores/useAuthStore";
import NewsService from "@services/Admin/NewsService";
import CategoryService from "@services/Admin/CategoryService";

import Sidebar from "@components/Admin/Sidebar";
import Header from "@components/Admin/Header";
import BottomNavigation from "@components/Admin/BottomNavigation";

const NewsSkeleton = () => {
  return (
    <div className="min-h-screen lg:px-4 md:p-0">
      {/* Back Button Skeleton */}
      <div className="mb-6">
        <div className="flex items-center text-gray-300">
          <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gray-200 rounded-full animate-pulse mr-2"></div>
          <div className="w-16 h-4 sm:h-5 md:h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6 animate-pulse">
        {/* Image and Basic Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Skeleton */}
          <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 bg-gray-200 rounded-md"></div>

          {/* Form Fields - Desktop */}
          <div className="hidden md:grid grid-cols-1 gap-4">
            {/* Title Field */}
            <div className="space-y-2">
              <div className="w-16 h-5 bg-gray-200 rounded"></div>
              <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <div className="w-20 h-5 bg-gray-200 rounded"></div>
              <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
            </div>

            {/* Date Field */}
            <div className="space-y-2">
              <div className="w-20 h-5 bg-gray-200 rounded"></div>
              <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Form Fields - Mobile */}
        <div className="md:hidden space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
            <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
            <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
          </div>

          {/* Date Field */}
          <div className="space-y-2">
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
            <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Content Field */}
        <div className="space-y-2">
          <div className="w-16 h-5 bg-gray-200 rounded"></div>
          <div className="w-full h-32 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Update Button */}
        <div className="flex justify-end">
          <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Comments Section */}
        <div className="mt-6 p-4 bg-white rounded-md">
          <div className="flex justify-between items-center">
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const News = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [newsImage, setNewsImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);

  const [newsData, setNewsData] = useState({
    title: "",
    content: "",
    category: "",
    date: "",
    photo_url: "",
  });

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

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);
      const response = await NewsService.getNewsDetail(id);
      const news = response.news;

      setNewsData({
        title: news.title,
        content: news.content,
        category: news.category?.id?.toString() || news.category_id?.toString(),
        date: news.date ? new Date(news.date).toISOString().split("T")[0] : "",
        photo_url: news.photo_url,
      });

      setNewsImage(news.photo_url);
    } catch (error) {
      console.error("Error fetching news detail:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal mengambil detail berita",
      });
    } finally {
      setLoading(false);
    }
  };

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
    if (id) {
      fetchNewsDetail();
      fetchComments(); // Fetch comments when the component mounts
    }
  }, [id]);

  const fetchComments = async () => {
    try {
      const response = await NewsService.getCommentsByIdNews(id);
      setComments(response.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal mengambil komentar",
      });
    }
  };

  const handleDeleteComments = async () => {
    try {
      await NewsService.deleteComments(selectedComments);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Komentar berhasil dihapus",
        timer: 1500,
        showConfirmButton: false,
      });
      setSelectedComments([]);
      fetchComments(); // Refresh comments after deletion
    } catch (error) {
      console.error("Error deleting comments:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menghapus komentar",
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedComments.length === comments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(comments.map((comment) => comment.id));
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewsImage(file); // Simpan file langsung, bukan URL
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewsImage(e.target.result); // Untuk preview saja
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <NewsSkeleton />;
  }

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
        initialValues={newsData}
        validationSchema={NewsSchema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            console.log("Update values:", values);
            setSubmitting(true);

            // Ambil admin_id dari token yang disimpan di Zustand
            const adminId = useAuthStore.getState().getAdminIdFromToken();

            if (!adminId) {
              throw new Error("Invalid admin id");
            }

            const updateData = {
              admin_id: adminId,
              title: values.title,
              content: values.content,
              category_id: parseInt(values.category),
              date: values.date,
              photo_url: newsData.photo_url, // Gunakan photo_url dari newsData
            };

            // Jika ada file gambar baru
            if (values.newsImage instanceof File) {
              updateData.new_image = values.newsImage; // Gunakan key berbeda untuk image baru
              updateData.old_photo_url = newsData.photo_url; // Kirim URL foto lama untuk dihapus
            }

            console.log("Update data:", updateData);
            await NewsService.updateNews(id, updateData);

            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: "Berita berhasil diperbarui",
              timer: 1500,
              showConfirmButton: false,
            });

            setNewsImage(null);
            resetForm();
            fetchNewsDetail(); // Refresh data setelah update
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
                    const file = e.target.files[0];
                    if (file) {
                      // Preview image
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setNewsImage(e.target.result); // Untuk preview
                      };
                      reader.readAsDataURL(file);
                      // Simpan file ke form values
                      setFieldValue("newsImage", file); // Gunakan newsImage sebagai key
                    }
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
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
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-red-500 text-xs sm:text-sm mt-1"
                  />
                </div>

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
            {comments.length > 0 && (
              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg mb-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedComments.length === comments.length}
                    onChange={handleSelectAll}
                    className="mr-2"
                  />
                  <span className="text-blue-600 font-semibold text-xs sm:text-sm md:text-base">
                    {selectedComments.length} komentar dipilih
                  </span>
                </div>
                <button
                  onClick={handleDeleteComments}
                  className="flex items-center text-red-500 hover:text-red-600 text-xs sm:text-sm md:text-base"
                >
                  <Trash2 className="mr-1" />
                  Hapus Terpilih
                </button>
              </div>
            )}
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={selectedComments.includes(comment.id)}
                    onChange={() => {
                      if (selectedComments.includes(comment.id)) {
                        setSelectedComments(
                          selectedComments.filter((id) => id !== comment.id)
                        );
                      } else {
                        setSelectedComments([...selectedComments, comment.id]);
                      }
                    }}
                  />
                  <div className="bg-gray-300 w-8 h-8 sm:w-10 sm:h-10 rounded-full"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base">
                      {comment.user.name}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-xs sm:text-sm md:text-base">
                Tidak ada komentar
              </p>
            )}
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
