import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert
import AuthService from "@services/AuthService";
import HappyBunch from "@assets/Auth/HappyBunch.png";
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from "lucide-react";

export default function RegisterPageAdmin() {
  const navigate = useNavigate();

  // Updated Validation Schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Format email tidak valid")
      .required("Email wajib diisi"),
    password: Yup.string()
      .required("Password wajib diisi")
      .min(8, "Password minimal 8 karakter"),
    role: Yup.string()
      .oneOf(["admin", "superadmin"], "Pilih role yang valid")
      .required("Role wajib dipilih"),
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Show loading indicator
      Swal.fire({
        title: "Sedang Mendaftar...",
        text: "Mohon tunggu sebentar",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Call AuthService register method
      const registeredUser = await AuthService.registerAdmin(values);

      // Close loading indicator
      Swal.close();

      // Show success alert
      await Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil!",
        text: "Akun admin berhasil dibuat.",
        confirmButtonText: "OK",
      });

      // Navigate to login page or dashboard
      navigate("/admin-login");
    } catch (error) {
      // Close loading indicator
      Swal.close();

      // Handle registration errors
      if (error.errors) {
        // If the backend returns specific field errors
        setErrors(error.errors);
      }

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: error.message || "Terjadi kesalahan saat mendaftar",
      });
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
              email: "",
              password: "",
              role: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                <div className="space-y-4 text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Registrasi Admin Baru
                  </h1>
                  <p className="text-sm md:text-base text-gray-600">
                    Buat akun admin untuk mengakses sistem Laporin
                  </p>
                </div>

                <div className="space-y-4">
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
                        placeholder="Masukkan email admin"
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
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
                        type={showPassword ? "text" : "password"}
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
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-70 transition-opacity"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Role Select */}
                  <div className="space-y-2">
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Role
                    </label>
                    <Field
                      as="select"
                      name="role"
                      className={`
                        w-full rounded-lg border p-3 focus:outline-none focus:ring-2 transition-all duration-300
                        ${
                          errors.role && touched.role
                            ? "border-red-500 focus:ring-red-500 bg-red-50"
                            : "border-gray-300 focus:ring-[#4338CA] hover:border-[#4338CA]/50"
                        }
                      `}
                    >
                      <option value="">Pilih Role</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </Field>
                    <ErrorMessage
                      name="role"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Submit Button */}
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
