import React, { useState, useMemo, useRef, useEffect } from "react";
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
  Pencil,
  Trash2,
  Mail,
  Edit,
  Phone,
  ChevronRight,
} from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useLocation, Link, useNavigate } from "react-router-dom";
import UserService from "@services/UserService";

const Sidebar = ({ className, onClose }) => {
  const location = useLocation();

  const isActivePath = (path) => {
    switch (path) {
      case "/admin/complaints":
        return location.pathname.startsWith("/admin/complaint");
      case "/admin/public-services":
        return location.pathname.startsWith("/admin/news");
      default:
        return location.pathname === path;
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
          { icon: PieChart, label: "Dashboard", path: "/admin/dashboard" },
          {
            icon: MessageSquare,
            label: "Complaint",
            path: "/admin/complaints",
          },
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
    switch (path) {
      case "/admin/complaints":
        return location.pathname.startsWith("/admin/complaint");
      case "/admin/public-services":
        return location.pathname.startsWith("/admin/news");
      default:
        return location.pathname === path;
    }
  };

  const navItems = [
    { icon: PieChart, label: "Dashboard", path: "/admin/dashboard" },
    { icon: MessageSquare, label: "Complaint", path: "/admin/complaints" },
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

const TableUser = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // State untuk loading
  const limit = 10; // Set limit sesuai kebutuhan

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Set loading ke true saat mulai mengambil data
      try {
        const data = await UserService.getAllUsers(currentPage, limit);
        setUsers(data.data || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Set loading ke false setelah data diambil
      }
    };

    fetchUsers();
  }, [currentPage]);

  const filteredUserData = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const UserSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Nama terlalu pendek!")
      .max(50, "Nama terlalu panjang!")
      .required("Nama wajib diisi"),
    email: Yup.string()
      .email("Email tidak valid")
      .required("Email wajib diisi"),
    phone: Yup.string()
      .matches(/^(\+62|62|0)8[1-9][0-9]{6,11}$/, "Nomor telepon tidak valid")
      .required("Nomor telepon wajib diisi"),
  });

  const handleAddUser = (values, { resetForm }) => {
    const newUser = {
      id: users.length + 1,
      name: values.name,
      email: values.email,
      phone: values.phone,
    };

    setUsers((prev) => [newUser, ...prev]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleUpdateUser = (values, { resetForm }) => {
    const updatedUser = {
      ...selectedUser,
      name: values.name,
      email: values.email,
      phone: values.phone,
    };

    setUsers((prev) =>
      prev.map((item) => (item.id === updatedUser.id ? updatedUser : item))
    );
    setIsUpdateModalOpen(false);
    resetForm();
  };

  const handleDeleteUsers = () => {
    setUsers((prev) => prev.filter((item) => !selectedUsers.includes(item.id)));
    setSelectedUsers([]);
  };

  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === filteredUserData.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUserData.map((user) => user.id));
    }
  };

  const renderUserCard = (user) => (
    <div className="rounded-lg md:p-4 mb-4 bg-white shadow-md">
      <div className="flex px-4 space-x-4">
        <div
          className="flex flex-col space-y-2 flex-1 pb-4 relative cursor-pointer"
          onClick={() => navigate(`/admin/user/${user.id}`)}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2 pr-2">
              {user.name}
            </h3>

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setActiveDropdown(
                    activeDropdown === user.id ? null : user.id
                  );
                }}
                className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
              >
                &#8942;
              </button>
              {activeDropdown === user.id && (
                <div className="absolute z-10 right-0 top-[100%] w-48 bg-white border rounded-md shadow-lg">
                  <button
                    onClick={() => {
                      openUpdateModal(user);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUsers([user.id]);
                      handleDeleteUsers();
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

          <div className="space-y-1">
            <p className="text-sm text-gray-500 flex items-center">
              <Mail size={16} className="mr-2 text-gray-400" />
              {user.email}
            </p>
            <p className="text-sm text-gray-500 flex items-center">
              <Phone size={16} className="mr-2 text-gray-400" />
              {user.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserTable = () => (
    <div className="md:bg-white md:shadow rounded-lg overflow-x-auto">
      <table className="w-full hidden sm:table">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-left">
              <input
                type="checkbox"
                checked={
                  filteredUserData.length > 0 &&
                  selectedUsers.length === filteredUserData.length
                }
                onChange={handleSelectAllUsers}
                className="form-checkbox h-5 w-5 text-indigo-600"
                onClick={(e) => e.stopPropagation()}
              />
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No Telepon
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredUserData.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleSelectUser(user.id)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
              </td>
              <td
                className="p-4 cursor-pointer"
                onClick={() => navigate(`/admin/user/${user.id}`)}
              >
                <div className="text-sm font-medium text-gray-900">
                  {user.name}
                </div>
              </td>
              <td
                className="p-4 cursor-pointer"
                onClick={() => navigate(`/admin/user/${user.id}`)}
              >
                <div className="text-sm text-gray-500">{user.email}</div>
              </td>
              <td
                className="p-4 text-sm text-gray-500 cursor-pointer"
                onClick={() => navigate(`/admin/user/${user.id}`)}
              >
                {user.phone}
              </td>
              <td className="p-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => openUpdateModal(user)}
                    className="text-indigo-600 hover:text-indigo-900 transition-colors"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUsers([user.id]);
                      handleDeleteUsers();
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
      <div className="sm:hidden">{filteredUserData.map(renderUserCard)}</div>

      {/* Empty State */}
      {filteredUserData.length === 0 && (
        <div className="text-center py-10 px-4">
          <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
            <Search size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Tidak ada user ditemukan
          </h3>
          <p className="text-gray-500 mb-4">
            Coba ubah kata kunci pencarian atau tambahkan user baru
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

  const renderPagination = () => {
    return (
      <div className="flex items-center justify-center gap-2 mt-6 pb-16 md:pb-8">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 text-sm ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          « Previous
        </button>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-3 py-1 rounded ${
                  pageNumber === currentPage
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {pageNumber}
              </button>
            );
          } else if (
            pageNumber === currentPage - 2 ||
            pageNumber === currentPage + 2
          ) {
            return (
              <span key={pageNumber} className="px-2">
                ...
              </span>
            );
          }
          return null;
        })}

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 text-sm ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Next »
        </button>
      </div>
    );
  };

  const renderModal = (isUpdate = false) => {
    const initialValues = isUpdate
      ? { ...selectedUser }
      : { name: "", email: "", phone: "" };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {isUpdate ? "Perbarui User" : "Tambah User Baru"}
            </h2>
            <button
              onClick={() =>
                isUpdate
                  ? setIsUpdateModalOpen(false)
                  : setIsAddModalOpen(false)
              }
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={UserSchema}
            onSubmit={isUpdate ? handleUpdateUser : handleAddUser}
          >
            {({ errors, touched }) => (
              <Form className="p-6 space-y-5">
                {[
                  {
                    name: "name",
                    label: "Nama",
                    type: "text",
                    placeholder: "Masukkan nama user",
                    icon: <User size={20} className="text-gray-400" />,
                  },
                  {
                    name: "email",
                    label: "Email",
                    type: "email",
                    placeholder: "Masukkan email user",
                    icon: <Mail size={20} className="text-gray-400" />,
                  },
                  {
                    name: "phone",
                    label: "Nomor Telepon",
                    type: "tel",
                    placeholder: "Masukkan nomor telepon",
                    icon: <Phone size={20} className="text-gray-400" />,
                  },
                ].map(({ name, label, type, placeholder, icon }) => (
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
                      <Field
                        type={type}
                        name={name}
                        id={name}
                        placeholder={placeholder}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none 
                            ${
                              touched[name] && errors[name]
                                ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            }`}
                      />
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
                    onClick={() =>
                      isUpdate
                        ? setIsUpdateModalOpen(false)
                        : setIsAddModalOpen(false)
                    }
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                  >
                    {isUpdate ? "Perbarui User" : "Tambah User"}
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
    <div className="md:max-w-6xl md:mx-auto md:px-4">
      <div className="flex flex-row justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Daftar User</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Plus size={20} className="mr-2" />
          Tambah
        </button>
      </div>

      {/* Bulk Action Area */}
      {selectedUsers.length > 0 && (
        <div className="bg-indigo-50 p-4 rounded-lg flex justify-between items-center mb-4">
          <p className="text-indigo-800">{selectedUsers.length} user dipilih</p>
          <button
            onClick={handleDeleteUsers}
            className="flex items-center text-red-600 hover:bg-red-100 px-3 py-2 rounded-md transition-colors"
          >
            <Trash2 size={20} className="mr-2" />
            Hapus Terpilih
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {renderUserTable()}
          {renderPagination()}
        </>
      )}

      {/* Modals */}
      {isAddModalOpen && renderModal()}
      {isUpdateModalOpen && renderModal(true)}
    </div>
  );
};

export default function UsersPage() {
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
            <TableUser />
            {/* <Pagination /> */}
          </div>
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
}
