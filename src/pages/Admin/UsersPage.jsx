import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  User,
  X,
  Plus,
  Pencil,
  Trash2,
  Mail,
  Phone,
} from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useNavigate } from "react-router-dom";

import UserService from "@services/Admin/UserService";

import Sidebar from "@components/Admin/Sidebar";
import Header from "@components/Admin/Header";
import BottomNavigation from "@components/Admin/BottomNavigation";

const UserTableSkeleton = () => {
  const renderSkeletonCard = () => (
    <div className="rounded-lg md:p-4 mb-4 bg-white shadow-md animate-pulse">
      <div className="flex px-4 space-x-4">
        <div className="flex flex-col space-y-2 flex-1 pb-4">
          <div className="flex items-center justify-between mt-2">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
          </div>

          <div className="space-y-1">
            <div className="h-4 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSkeletonTableRow = () => (
    <tr className="animate-pulse hover:bg-gray-50">
      <td className="p-4">
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </td>
      <td className="p-4">
        <div className="flex space-x-4">
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="md:max-w-6xl md:mx-auto ">
      {/* Desktop Table Skeleton */}
      <div className="md:bg-white md:shadow rounded-lg overflow-x-auto hidden sm:block">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 w-1/12">
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
              </th>
              <th className="p-4 text-left w-3/12">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </th>
              <th className="p-4 text-left w-3/12">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </th>
              <th className="p-4 text-left w-3/12">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </th>
              <th className="p-4 text-left w-2/12">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...Array(10)].map((_, index) => renderSkeletonTableRow(index))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Skeleton */}
      <div className="sm:hidden">
        {[...Array(10)].map((_, index) => renderSkeletonCard(index))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center gap-2 mt-6 pb-16 md:pb-8 animate-pulse">
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
        <div className="space-x-2">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="inline-block h-8 w-8 bg-gray-200 rounded"
            ></div>
          ))}
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
      </div>
    </div>
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
        <h1 className="text-2xl font-bold text-gray-800">Daftar User</h1>
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
        <UserTableSkeleton />
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
