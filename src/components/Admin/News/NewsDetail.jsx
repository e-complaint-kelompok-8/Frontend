import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

import useAuthStore from "@stores/useAuthStore";
import NewsService from "@services/Admin/NewsService";
import { useFetchCategories } from "@hooks/useFetchCategories";
import { useFetchNewsDetail } from "@hooks/useFetchNewsDetail";
import { useFetchComments } from "@hooks/useFetchComments";
import NewsSkeleton from "./NewsSkeleton";

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const categories = useFetchCategories();
  const { newsData, loading } = useFetchNewsDetail(id);
  const comments = useFetchComments(id);

  const [newsImage, setNewsImage] = useState(newsData.photo_url);
  const [selectedComments, setSelectedComments] = useState([]);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

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

      {loading ? (
        <NewsSkeleton />
      ) : (
        <div>
          <Formik
            initialValues={newsData}
            validationSchema={NewsSchema}
            enableReinitialize
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                setSubmitting(true);

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
                  photo_url: newsData.photo_url,
                };

                if (values.newsImage instanceof File) {
                  updateData.new_image = values.newsImage;
                  updateData.old_photo_url = newsData.photo_url;
                }

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
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setNewsImage(e.target.result);
                          };
                          reader.readAsDataURL(file);
                          setFieldValue("newsImage", file);
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
                            setSelectedComments([
                              ...selectedComments,
                              comment.id,
                            ]);
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
      )}
    </div>
  );
};

export default NewsDetail;
