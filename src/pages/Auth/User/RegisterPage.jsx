import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert
import AuthService from "@services/AuthService";
import HappyBunch from "@assets/Auth/HappyBunch.png";
import { Eye, EyeOff, ArrowLeft, Mail, Phone, Lock, User } from "lucide-react";
import useAuthStore from "@stores/useAuthStore";

export default function RegisterPage() {
  const navigate = useNavigate();

  // Validation schema (remains the same as in the original code)
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Nama wajib diisi")
      .min(2, "Nama minimal 2 karakter"),
    email: Yup.string()
      .email("Format email tidak valid")
      .required("Email wajib diisi"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]+$/, "Nomor handphone harus berupa angka")
      .min(10, "Nomor handphone minimal 10 digit")
      .max(15, "Nomor handphone maksimal 15 digit")
      .required("Nomor handphone wajib diisi"),
    password: Yup.string()
      .required("Password wajib diisi")
      .min(8, "Password minimal 8 karakter"),
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //   "Password harus mengandung huruf besar, huruf kecil, angka, dan karakter spesial"
    // ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Konfirmasi password tidak cocok")
      .required("Konfirmasi password wajib diisi"),
  });

  // State for password visibility (remains the same)
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  // Toggle password visibility (remains the same)
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...submitValues } = values;

      // Show loading indicator
      Swal.fire({
        title: "Sedang Mendaftar...",
        text: "Mohon tunggu sebentar",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Call AuthService register method
      const registeredUser = await AuthService.register(submitValues);

      // Close loading indicator
      Swal.close();

      // Show success alert
      await Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil!",
        text: "Silakan verifikasi OTP untuk melanjutkan.",
        confirmButtonText: "OK",
      });

      // Store email in global state before navigating
      useAuthStore.getState().setEmail(submitValues.email);

      // Navigate to OTP verification page
      navigate("/verify-otp", {
        state: {
          email: submitValues.email,
          phoneNumber: submitValues.phoneNumber,
        },
      });
    } catch (error) {
      // Close loading indicator
      Swal.close();

      // Handle registration errors
      if (error.response && error.response.data) {
        // If the backend returns specific field errors
        const backendErrors = error.response.data.errors;
        if (backendErrors) {
          setErrors(backendErrors);
        }

        // Show error alert
        Swal.fire({
          icon: "error",
          title: "Registrasi Gagal",
          text:
            error.response.data.message || "Terjadi kesalahan saat mendaftar",
        });
      } else {
        // Network or unexpected error
        Swal.fire({
          icon: "error",
          title: "Kesalahan",
          text: "Terjadi kesalahan. Silakan coba lagi.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-[#4338CA] to-[#6366F1] overflow-hidden">
      {/* Left Section - Mobile Optimized */}
      <div className="lg:w-1/2 bg-transparent p-4 lg:p-8 flex flex-col relative lg:fixed lg:h-screen">
        <button
          className="text-white hover:opacity-80 mb-4 flex items-center space-x-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="text-sm">Kembali</span>
        </button>

        <div className="flex justify-center items-center h-full relative">
          {/* Animated Shadow Circle */}
          <div className="absolute -bottom-0 w-3/4 sm:w-1/2 h-1/4 bg-white opacity-20 rounded-full blur-3xl "></div>

          {/* Gambar dengan Animasi */}
          <img
            src={HappyBunch}
            alt="Person at desk illustration"
            className="w-full sm:w-3/4 lg:w-4/5 max-w-lg relative z-10 object-contain transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>

      {/* Right Section - Mobile Optimized */}
      <div className="lg:ml-auto lg:w-1/2 p-4 lg:p-8 flex flex-col justify-center overflow-y-auto bg-white/90 backdrop-blur-sm lg:bg-white/80 rounded-t-3xl lg:rounded-l-3xl lg:rounded-bl-3xl  lg:rounded-tr-none shadow-2xl">
        <div className="w-full max-w-md mx-auto space-y-6">
          <Formik
            initialValues={{
              name: "",
              email: "",
              phoneNumber: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                <div className="space-y-4 text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Buat Akun Baru di Laporin!
                  </h1>
                  <p className="text-sm md:text-base text-gray-600">
                    Gabung bersama kami untuk menyampaikan keluhan dan solusi
                    dengan mudah
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Nama Input */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nama
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type="text"
                        name="name"
                        className={`
                          pl-10 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 transition-all duration-300
                          ${
                            errors.name && touched.name
                              ? "border-red-500 focus:ring-red-500 bg-red-50"
                              : "border-gray-300 focus:ring-[#4338CA] hover:border-[#4338CA]/50"
                          }
                        `}
                        placeholder="Masukkan nama Anda"
                      />
                    </div>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1 "
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type="email"
                        name="email"
                        className={`
                          pl-10 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 transition-all duration-300
                          ${
                            errors.email && touched.email
                              ? "border-red-500 focus:ring-red-500 bg-red-50"
                              : "border-gray-300 focus:ring-[#4338CA] hover:border-[#4338CA]/50"
                          }
                        `}
                        placeholder="Masukkan email Anda"
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1 "
                    />
                  </div>

                  {/* No HandPhone Input */}
                  <div className="space-y-2">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      No HandPhone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type="tel"
                        name="phoneNumber"
                        className={`
                          pl-10 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 transition-all duration-300
                          ${
                            errors.phoneNumber && touched.phoneNumber
                              ? "border-red-500 focus:ring-red-500 bg-red-50"
                              : "border-gray-300 focus:ring-[#4338CA] hover:border-[#4338CA]/50"
                          }
                        `}
                        placeholder="Masukkan nomor handphone"
                      />
                    </div>
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="text-red-500 text-sm mt-1 "
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type={showPassword.password ? "text" : "password"}
                        name="password"
                        className={`
                          pl-10 pr-10 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 transition-all duration-300
                          ${
                            errors.password && touched.password
                              ? "border-red-500 focus:ring-red-500 bg-red-50"
                              : "border-gray-300 focus:ring-[#4338CA] hover:border-[#4338CA]/50"
                          }
                        `}
                        placeholder="Masukkan password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("password")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-70 transition-opacity"
                      >
                        {showPassword.password ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1 "
                    />
                  </div>

                  {/* Konfirmasi Password Input */}
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type={
                          showPassword.confirmPassword ? "text" : "password"
                        }
                        name="confirmPassword"
                        className={`
                          pl-10 pr-10 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 transition-all duration-300
                          ${
                            errors.confirmPassword && touched.confirmPassword
                              ? "border-red-500 focus:ring-red-500 bg-red-50"
                              : "border-gray-300 focus:ring-[#4338CA] hover:border-[#4338CA]/50"
                          }
                        `}
                        placeholder="Konfirmasi password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-70 transition-opacity"
                      >
                        {showPassword.confirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-sm mt-1 "
                    />
                  </div>

                  {/* Tombol Daftar */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#4338CA] to-[#6366F1] text-white rounded-lg p-3 
                    hover:from-[#3730A3] hover:to-[#4f46e5] 
                    transition-all duration-300 transform active:scale-95
                    disabled:opacity-50 disabled:cursor-not-allowed
                    shadow-md hover:shadow-lg"
                  >
                    DAFTAR
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          {/* Tambahan untuk Mobile/Tablet */}
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              Sudah punya akun?{" "}
              <a href="/login" className="text-[#4338CA] hover:underline">
                Masuk Sekarang
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
