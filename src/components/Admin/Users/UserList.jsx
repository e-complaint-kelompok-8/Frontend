import React, { useState, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePagination } from "@hooks/Admin/usePagination";
import { useFetchUsers } from "@hooks/Admin/useFetchUsers";
import UserTable from "./UserTable";
import UserModal from "./UserModal";
import UserSkeleton from "./UserSkeleton";

import UserCard from "./UserCard";

const UserList = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const limit = 10;
  const { currentPage, handlePageChange } = usePagination();
  const { users, totalPages, loading } = useFetchUsers(currentPage, limit);

  const filteredUserData = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleDeleteUsers = () => {
    setUsers((prev) => prev.filter((item) => !selectedUsers.includes(item.id)));
    setSelectedUsers([]);
  };

  const handleDeleteUser = (userId) => {
    setUsers((prev) => prev.filter((item) => item.id !== userId));
  };

  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="md:max-w-6xl md:mx-auto md:px-4">
      <div className="flex flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar User</h1>
        {/* <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Plus size={20} className="mr-2" />
          Tambah
        </button> */}
      </div>

      {/* {selectedUsers.length > 0 && (
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
      )} */}

      {loading ? (
        <UserSkeleton />
      ) : (
        <>
          <UserTable
            users={filteredUserData}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            openUpdateModal={openUpdateModal}
            navigate={navigate}
          />
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
            {filteredUserData.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                openUpdateModal={openUpdateModal}
                handleDeleteUser={handleDeleteUser}
                navigate={navigate}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mt-6 pb-16 md:pb-8">
            <button
              onClick={() => handlePageChange(currentPage - 1, totalPages)}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-sm ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              « Previous
            </button>

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
                    onClick={() => handlePageChange(pageNumber, totalPages)}
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

            <button
              onClick={() => handlePageChange(currentPage + 1, totalPages)}
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
        </>
      )}

      {isAddModalOpen && (
        <UserModal
          isOpen={isAddModalOpen}
          setIsOpen={setIsAddModalOpen}
          isUpdate={false}
        />
      )}
      {isUpdateModalOpen && (
        <UserModal
          isOpen={isUpdateModalOpen}
          setIsOpen={setIsUpdateModalOpen}
          isUpdate={true}
          selectedUser={selectedUser}
        />
      )}
    </div>
  );
};

export default UserList;
