import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Mail, Camera, Eye, Lock, EyeOff, User } from "lucide-react";
import Swal from "sweetalert2";

import AdminService from "@services/Admin/AdminService";
import useAdminStore from "@stores/useAdminStore";

const ProfileSkeleton = () => {
  return (
    <div className="flex overflow-hidden justify-center items-center lg:mt-4 md:mt-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="space-y-4 text-center mb-6">
          <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>

        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center relative border-4 border-[#4338CA]/20">
              <User className="w-16 h-16 text-gray-400" />
              <button
                className="absolute bottom-0 right-0 bg-gray-300 text-white rounded-full p-2"
                disabled
              >
                <Camera size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center"></div>
              <div className="pl-10 w-full rounded-lg border border-gray-300 p-3 bg-gray-200"></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center"></div>
              <div className="pl-10 pr-10 w-full rounded-lg border border-gray-300 p-3 bg-gray-200"></div>
            </div>
          </div>

          <div className="w-full rounded-lg p-3 bg-gray-300 h-12"></div>
        </div>
      </div>
    </div>
  );
};

const ProfileContent = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [initialValues, setInitialValues] = useState({
    email: "",
    role: "",
    password: "",
    photo_url: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profile = await AdminService.getProfile();
        setProfileImage(profile.photo);

        setInitialValues({
          email: profile.email,
          role: profile.role,
          password: "",
          photo_url: profile.photo,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal mengambil data profil",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email tidak valid")
      .required("Email wajib diisi"),
    role: Yup.string().required("Role wajib diisi"),
    password: Yup.string().min(6, "Password minimal 6 karakter").optional(),
    photo: Yup.mixed()
      .test("fileSize", "Ukuran file terlalu besar", (value) => {
        if (!value || typeof value === "string") return true;
        return value.size <= 5 * 1024 * 1024;
      })
      .test("fileType", "Format file tidak valid", (value) => {
        if (!value || typeof value === "string") return true;
        return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      }),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);

      const updateData = {
        email: values.email,
        role: values.role,
      };

      if (values.password) {
        updateData.password = values.password;
      }

      if (values.photo instanceof File) {
        updateData.new_image = values.photo;
        updateData.old_photo_url = initialValues.photo_url;
      }

      const updatedProfile = await AdminService.updateProfile(updateData);

      // Update Zustand store with the fetched profile data
      useAdminStore.getState().setProfileData({
        email: updatedProfile.email,
        role: updatedProfile.role,
        photo: updatedProfile.photo || initialValues.photo_url,
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Profil berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Gagal memperbarui profil",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ukuran file terlalu besar (maksimal 5MB)",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setFieldValue("photo", file);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="flex overflow-hidden justify-center items-center lg:mt-4 md:mt-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, setFieldValue }) => (
            <Form className="space-y-6">
              <div className="space-y-4 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Edit Profil
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                  Perbarui informasi profil Anda
                </p>
              </div>

              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center relative border-4 border-[#4338CA]/20">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-500" />
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-gradient-to-r from-[#4338CA] to-[#6366F1] text-white rounded-full p-2
                      hover:from-[#3730A3] hover:to-[#4f46e5]
                      transition-all duration-300 transform active:scale-95
                      shadow-md hover:shadow-lg"
                    >
                      <Camera size={16} />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

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
                    className={`pl-10 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 transition-all duration-300
                      ${
                        errors.email && touched.email
                          ? "border-red-500 focus:ring-red-500 bg-red-50"
                          : "border-gray-300 focus:ring-[#4338CA] hover:border-[#4338CA]/50"
                      }`}
                    placeholder="Masukkan email Anda"
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

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
                    className={`pl-10 pr-10 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 transition-all duration-300
                      ${
                        errors.password && touched.password
                          ? "border-red-500 focus:ring-red-500 bg-red-50"
                          : "border-gray-300 focus:ring-[#4338CA] hover:border-[#4338CA]/50"
                      }`}
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
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

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-[#4338CA] to-[#6366F1] text-white rounded-lg p-3
                hover:from-[#3730A3] hover:to-[#4f46e5]
                transition-all duration-300 transform active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-md hover:shadow-lg
                flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    <span>Memperbarui...</span>
                  </>
                ) : (
                  "Perbarui Profil"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProfileContent;
