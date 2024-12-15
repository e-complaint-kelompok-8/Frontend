import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  MessageSquare,
  PieChart,
  Search,
  Settings,
  Users,
  User,
  X,
  Edit,
  Mail,
  Camera,
  Eye,
  Lock,
  EyeOff,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAuthStore from "@stores/useAuthStore";
import AdminService from "@services/AdminService";
import Swal from "sweetalert2";

const Sidebar = ({ className, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Anda akan keluar dari aplikasi",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Keluar!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        useAuthStore.getState().clearAuth();
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Error during logout:", error);
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
          { icon: PieChart, label: "Dashboard", path: "/" },
          { icon: MessageSquare, label: "Complaint", path: "/complaint" },
          { icon: Users, label: "Public Services", path: "/public-services" },
          { icon: Users, label: "Users", path: "/users" },
        ].map(({ icon: Icon, label, path }) => (
          <Link
            key={label}
            to={path}
            className={`flex items-center space-x-2 py-2 px-2 rounded-lg transition-colors ${
              isActivePath(path)
                ? "bg-white text-indigo-700"
                : "text-white hover:text-indigo-200 hover:bg-indigo-600"
            }`}
          >
            <Icon size={20} />
            <span className="text-sm md:text-base">{label}</span>
          </Link>
        ))}
      </nav>
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-white hover:text-indigo-200 py-2 px-2 rounded-lg hover:bg-indigo-600 transition-colors w-full text-left"
        >
          <LogOut size={20} />
          <span className="text-sm md:text-base">Log-Out</span>
        </button>
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
    { icon: PieChart, label: "Dashboard", path: "/" },
    { icon: MessageSquare, label: "Complaint", path: "/complaint" },
    { icon: Users, label: "Services", path: "/public-services" },
    { icon: User, label: "Users", path: "/users" },
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
  const [adminProfile, setAdminProfile] = useState({
    email: "",
    role: "",
    photo: "",
  });
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const profile = await AdminService.getProfile();
        setAdminProfile({
          email: profile.email || "",
          role: profile.role || "",
          photo: profile.photo || "",
        });
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      }
    };
    fetchAdminProfile();
  }, []);

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
    navigate("/admin/profile/");
    setShowProfileDropdown(false);
  };

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Anda akan keluar dari aplikasi",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Keluar!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        useAuthStore.getState().clearAuth();
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const getDisplayName = () => {
    if (!adminProfile.email) return "Admin";
    return adminProfile.email.split("@")[0];
  };

  const getInitial = () => {
    if (!adminProfile.email) return "A";
    return adminProfile.email.charAt(0).toUpperCase();
  };

  const getRole = () => {
    if (!adminProfile.role) return "";
    return (
      adminProfile.role.charAt(0).toUpperCase() + adminProfile.role.slice(1)
    );
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
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
          <div className="flex items-center space-x-4">
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
                <div className="fixed md:absolute top-16 md:top-auto right-4 md:right-0 md:mt-4 w-[calc(100%-2rem)] md:w-96 bg-white border-none rounded-lg shadow-2xl z-50">
                  <div className="p-4">
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
                            <span className="text-gray-600 text-lg">
                              {complaint.sender.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-3 flex-grow">
                            <p className="text-sm font-medium text-gray-800">
                              {complaint.sender} Baru Saja Complaint
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {complaint.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
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
                <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                  {adminProfile.photo ? (
                    <img
                      src={adminProfile.photo}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                      {getInitial()}
                    </div>
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">
                    Halo! {getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500">{getRole()}</p>
                </div>
                <ChevronRight
                  size={20}
                  className={`transition-transform duration-300 ${
                    showProfileDropdown ? "rotate-90" : ""
                  }`}
                />
              </div>

              {showProfileDropdown && (
                <div className="fixed md:absolute top-16 md:top-auto right-4 md:right-0 md:mt-4 w-[calc(50%-2rem)] md:w-48 bg-white rounded-lg shadow-2xl z-50">
                  <div className="py-1">
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Settings className="h-5 w-5 text-gray-500" />
                      <span>Profil</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                    >
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

const ProfileForm = () => {
  const [profileImage, setProfileImage] = useState(null);
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
      try {
        const profile = await AdminService.getProfile();
        console.log(profile);
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
      }
    };

    fetchProfile();
  }, []);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email tidak valid")
      .required("Email wajib diisi"),
    role: Yup.string().required("Role wajib diisi"),
    password: Yup.string().min(6, "Password minimal 6 karakter").optional(), // Password bersifat opsional
    photo: Yup.mixed()
      .test("fileSize", "Ukuran file terlalu besar", (value) => {
        if (!value || typeof value === "string") return true;
        return value.size <= 5 * 1024 * 1024; // 5MB
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

      // Tambahkan password hanya jika diisi
      if (values.password) {
        updateData.password = values.password;
      }

      // Jika ada file gambar baru
      if (values.photo instanceof File) {
        updateData.new_image = values.photo;
        updateData.old_photo_url = initialValues.photo_url;
      }

      const updatedProfile = await AdminService.updateProfile(updateData);

      // Update local storage atau state global jika perlu
      useAuthStore.getState().setEmail(updatedProfile.email);

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

              {/* Profile Image Upload */}
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

              {/* Update Button */}
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

export default function Profile() {
  return (
    <div className="flex h-screen bg-gray-100 pb-16 md:pb-16 lg:pb-0">
      {/* Persistent Sidebar for Large Screens */}
      <Sidebar className="hidden lg:block w-64 fixed h-full" />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
            <ProfileForm />
          </div>
        </main>

        {/* Bottom Navigation for Mobile and Tablet */}
        <BottomNavigation />
      </div>
    </div>
  );
}
