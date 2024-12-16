// components/News/NewsModal.js
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { X, FileImage, Pencil, Calendar } from "lucide-react";
import Swal from "sweetalert2";
import NewsService from "@services/Admin/NewsService";
import useAuthStore from "@stores/useAuthStore";

const NewsModal = ({
  isOpen,
  setIsOpen,
  categories,
  fetchNews,
  newsItem,
  setLoadingAction,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const getAdminIdFromToken = useAuthStore(
    (state) => state.getAdminIdFromToken
  );

  useEffect(() => {
    if (newsItem) {
      setSelectedImage(newsItem.photo_url);
    } else {
      setSelectedImage(null);
    }
  }, [newsItem]);

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
    image: Yup.mixed()
      .nullable()
      .test("fileSize", "Ukuran file terlalu besar", (value) => {
        if (!value || typeof value === "string") return true;
        return value.size <= 5 * 1024 * 1024;
      })
      .test("fileType", "Format file tidak valid", (value) => {
        if (!value || typeof value === "string") return true;
        return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      }),
  });

  const handleImageChange = async (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setSelectedImage(URL.createObjectURL(file));
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

  const handleCloseModal = (resetForm) => {
    resetForm();
    setSelectedImage(null);
    setIsOpen(false);
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      setLoadingAction(true); // Start loading
      const adminId = getAdminIdFromToken();

      if (!adminId) {
        throw new Error("Invalid admin id");
      }

      if (newsItem) {
        const updateData = {
          admin_id: adminId,
          title: values.title,
          content: values.content,
          category_id: parseInt(values.category),
          date: formatDate(values.date),
          photo_url: newsItem.photo_url,
        };

        if (values.image instanceof File) {
          updateData.new_image = values.image;
          updateData.old_photo_url = newsItem.photo_url;
        }

        await NewsService.updateNews(newsItem.id, updateData);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Berita berhasil diperbarui",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchNews();
      } else {
        await NewsService.createNews({
          admin_id: adminId,
          title: values.title,
          content: values.content,
          category_id: values.category,
          date: formatDate(values.date),
          image: values.image,
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Berita berhasil ditambahkan",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchNews();
      }

      setSelectedImage(null);
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting news:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal memproses berita",
      });
    } finally {
      setSubmitting(false);
      setLoadingAction(false); // End loading
    }
  };

  const initialValues = newsItem
    ? {
        title: newsItem.title,
        content: newsItem.content,
        category: newsItem.category.id.toString(),
        date: formatDate(newsItem.date),
        image: newsItem.photo_url,
      }
    : {
        title: "",
        content: "",
        category: "",
        date: "",
        image: null,
      };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {newsItem ? "Perbarui Berita" : "Tambah Berita Baru"}
            </h2>
            <button
              onClick={() => handleCloseModal(() => {})}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={NewsSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ setFieldValue, errors, touched, resetForm, isSubmitting }) => (
              <Form className="p-6 space-y-5">
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

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => handleCloseModal(resetForm)}
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
                    ) : newsItem ? (
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
    )
  );
};

export default NewsModal;
