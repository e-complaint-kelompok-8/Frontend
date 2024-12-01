import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft, Lock } from "lucide-react";
import AuthService from "@services/AuthService";
import HappyBunch from "@assets/Auth/HappyBunch.png";
import useAuthStore from "@stores/useAuthStore";

export default function OTPVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get email and phone number from navigation state
  const [email, setEmail] = useState("");
  const [no_telp, setNo_telp] = useState("");

  useEffect(() => {
    const storedEmail = useAuthStore.getState().email;

    if (!storedEmail) {
      Swal.fire({
        icon: "warning",
        title: "Sesi Berakhir",
        text: "Silakan mendaftar ulang",
        confirmButtonText: "Kembali ke Pendaftaran",
      }).then(() => {
        navigate("/register");
      });
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .matches(/^\d{6}$/, "OTP harus terdiri dari 6 digit angka")
      .required("OTP wajib diisi"),
  });

  // Refs for OTP input fields
  const otpInputRefs = useRef([]);

  const handleOTPChange = (e, setFieldValue, index) => {
    const value = e.target.value;

    // Check if pasted value is 6 digits
    if (value.length === 6 && /^\d{6}$/.test(value)) {
      // Automatically fill all OTP inputs
      value.split("").forEach((digit, idx) => {
        otpInputRefs.current[idx].value = digit;
      });

      // Set the full OTP value
      setFieldValue("otp", value);

      // Focus on the last input
      otpInputRefs.current[5].focus();
      return;
    }

    // Existing single digit input logic
    if (/^\d*$/.test(value)) {
      // Update field value
      setFieldValue(
        `otp`,
        otpInputRefs.current
          .map((ref) => ref.value)
          .map((val, i) => (i === index ? value : val))
          .join("")
      );

      // Auto-focus to next input if current input is filled
      if (value.length === 1 && index < 5) {
        otpInputRefs.current[index + 1].focus();
      }
    }
  };
  // Handle OTP input backspace
  const handleOTPBackspace = (e, setFieldValue, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      otpInputRefs.current[index - 1].focus();

      // Remove last digit from OTP
      setFieldValue(
        `otp`,
        otpInputRefs.current
          .map((ref) => ref.value)
          .slice(0, -1)
          .join("")
      );
    }
  };

  const handleOTPPaste = (e, setFieldValue) => {
    const paste = e.clipboardData.getData("text");

    // Hanya proses jika teks yang di-paste adalah enam angka
    if (/^\d{6}$/.test(paste)) {
      // Pisahkan angka ke dalam array
      const otpArray = paste.split("");

      // Isi setiap input dengan angka yang sesuai
      otpArray.forEach((digit, index) => {
        if (otpInputRefs.current[index]) {
          otpInputRefs.current[index].value = digit;
        }
      });

      // Update nilai OTP di Formik
      setFieldValue("otp", paste);

      // Fokuskan ke input terakhir
      otpInputRefs.current[5]?.focus();
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    try {
      // Show loading
      Swal.fire({
        title: "Mengirim Ulang OTP...",
        text: "Mohon tunggu sebentar",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Call backend to resend OTP
      await AuthService.resendOtp({ email, no_telp });

      // Show success message
      Swal.fire({
        icon: "success",
        title: "OTP Terkirim",
        text: "Kode OTP baru telah dikirim ke email Anda",
      });
    } catch (error) {
      // Handle error
      Swal.fire({
        icon: "error",
        title: "Gagal Mengirim Ulang OTP",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Show loading
      Swal.fire({
        title: "Memverifikasi OTP...",
        text: "Mohon tunggu sebentar",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Prepare OTP verification data
      const otpData = {
        email,
        no_telp,
        otp: values.otp,
      };

      // Verify OTP
      await AuthService.verifyOtp(otpData);

      // Close loading
      Swal.close();

      // Show success and navigate
      await Swal.fire({
        icon: "success",
        title: "Verifikasi Berhasil!",
        text: "Akun Anda telah diverifikasi",
        confirmButtonText: "Lanjutkan",
      });

      // Clear the email from global state
      useAuthStore.getState().clearEmail();

      // Navigate to login or dashboard
      navigate("/login");
    } catch (error) {
      // Close loading
      Swal.close();

      // Show error message
      Swal.fire({
        icon: "error",
        title: "Verifikasi Gagal",
        text: error.response?.data?.message || "Kode OTP tidak valid",
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
          onClick={() => navigate("/register")}
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
      <div className="lg:ml-auto lg:w-1/2 p-4 lg:p-8 flex flex-col justify-center overflow-y-auto bg-white/90 backdrop-blur-sm lg:bg-white/80 rounded-t-3xl lg:rounded-none shadow-2xl">
        <div className="w-full max-w-md mx-auto space-y-6">
          <Formik
            initialValues={{
              otp: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, setFieldValue }) => (
              <Form className="space-y-6">
                <div className="space-y-4 text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Verifikasi OTP
                  </h1>
                  <p className="text-sm md:text-base text-gray-600">
                    Masukkan kode 6 digit yang dikirimkan ke email {email}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* OTP Input */}
                  <div className="space-y-2">
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Kode OTP
                    </label>
                    <div className="flex justify-between space-x-2">
                      {[...Array(6)].map((_, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength="1"
                          ref={(ref) => (otpInputRefs.current[index] = ref)}
                          onChange={(e) =>
                            handleOTPChange(e, setFieldValue, index)
                          }
                          onKeyDown={(e) =>
                            handleOTPBackspace(e, setFieldValue, index)
                          }
                          onPaste={(e) => handleOTPPaste(e, setFieldValue)}
                          className={`
        w-full text-center rounded-lg border p-3 focus:outline-none focus:ring-2 
        text-xl font-bold tracking-widest
        transition-all duration-300
        ${
          errors.otp && touched.otp
            ? "border-red-500 focus:ring-red-500 bg-red-50"
            : "border-gray-300 focus:ring-[#4338CA] hover:border-[#4338CA]/50"
        }
      `}
                          placeholder="-"
                        />
                      ))}
                    </div>
                    <ErrorMessage
                      name="otp"
                      component="div"
                      className="text-red-500 text-sm mt-1 text-center"
                    />
                  </div>

                  {/* Verification Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#4338CA] to-[#6366F1] text-white rounded-lg p-3 
                    hover:from-[#3730A3] hover:to-[#4f46e5] 
                    transition-all duration-300 transform active:scale-95
                    disabled:opacity-50 disabled:cursor-not-allowed
                    shadow-md hover:shadow-lg"
                  >
                    VERIFIKASI
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          {/* Resend OTP Section */}
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              Tidak menerima kode?{" "}
              <button
                className="text-[#4338CA] hover:underline"
                onClick={handleResendOTP}
              >
                Kirim Ulang
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
