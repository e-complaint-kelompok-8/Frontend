import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom"; // Assuming React Router
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2"; // Import SweetAlert2
import HappyBunch from "@assets/Auth/HappyBunch.png";
import AuthService from "@services/AuthService"; // Adjust path as needed
import useAuthStore from "@stores/useAuthStore";

export default function LoginPageAdmin() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Format email tidak valid")
      .required("Email wajib diisi"),
    password: Yup.string().required("Password wajib diisi"),
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Show loading indicator
      Swal.fire({
        title: "Sedang Masuk...",
        text: "Mohon tunggu sebentar",
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
      });

      setLoginError(null);
      const adminData = await AuthService.loginAdmin(values);

      // // Save token to global state
      const { setToken } = useAuthStore.getState();
      setToken(adminData.token);

      // Get role from token
      const role = useAuthStore.getState().getRoleFromToken();

      // Close loading indicator
      Swal.close();

      // Redirect based on user role
      if (role === "admin" || role === "superadmin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      // Close loading indicator
      Swal.close();

      // Handle login errors
      const errorMessage =
        error.response?.data?.message || "Login gagal. Silakan coba lagi.";

      setLoginError(errorMessage);
      setSubmitting(false);

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-[#4338CA] to-[#6366F1] overflow-hidden">
      {/* Left Section - Mobile Optimized */}
      <div className="lg:w-1/2 bg-transparent p-4 lg:p-8 flex flex-col relative lg:fixed lg:h-screen">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:opacity-80 mb-4 flex items-center space-x-2"
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="text-sm">Kembali</span>
        </button>

        <div className="flex justify-center items-center h-full relative">
          {/* Animated Shadow Circle */}
          <div className="absolute -bottom-0 w-3/4 sm:w-1/2 h-1/4 bg-white opacity-20 rounded-full blur-3xl "></div>

          {/* Image with Animation */}
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
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                <div className="space-y-4 text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Selamat Datang di Laporin!
                  </h1>
                  <p className="text-sm md:text-base text-gray-600">
                    Masuk untuk mulai menyampaikan keluhan Anda dengan mudah
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
                            (errors.email && touched.email) || loginError
                              ? "border-red-500 focus:ring-red-500 bg-red-50"
                              : "border-gray-300 focus:ring-[#4338CA] hover:border-[#4338CA]/50"
                          }
                        `}
                        placeholder="Masukkan email Anda"
                      />
                    </div>
                    {/* Email Error Message */}
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
                            (errors.password && touched.password) || loginError
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
                    {/* Password Error Message */}
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />

                    {/* Global Login Error Message */}
                    {loginError && (
                      <div className="text-red-500 text-sm mt-1">
                        {loginError}
                      </div>
                    )}
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#4338CA] to-[#6366F1] text-white rounded-lg p-3 
                    hover:from-[#3730A3] hover:to-[#4f46e5] 
                    transition-all duration-300 transform active:scale-95
                    disabled:opacity-50 disabled:cursor-not-allowed
                    shadow-md hover:shadow-lg"
                  >
                    MASUK
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          {/* Additional for Mobile/Tablet */}
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              Belum punya akun?{" "}
              <a
                href="/admin-register"
                className="text-[#4338CA] hover:underline"
              >
                Daftar Sekarang
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
