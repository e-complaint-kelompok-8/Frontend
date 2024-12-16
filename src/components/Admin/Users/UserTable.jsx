import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const UserTable = ({
  users,
  selectedUsers,
  setSelectedUsers,
  openUpdateModal,
  navigate,
}) => {
  const handleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  return (
    <div className="md:bg-white md:shadow rounded-lg overflow-x-auto">
      <table className="w-full hidden sm:table">
        <thead className="bg-gray-50 border-b">
          <tr>
            {/* <th className="p-4 text-left">
              <input
                type="checkbox"
                checked={
                  users.length > 0 && selectedUsers.length === users.length
                }
                onChange={handleSelectAllUsers}
                className="form-checkbox h-5 w-5 text-indigo-600"
                onClick={(e) => e.stopPropagation()}
              />
            </th> */}
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No Telepon
            </th>
            {/* <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th> */}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              {/* <td className="p-4" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleSelectUser(user.id)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
              </td> */}
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
              {/* <td className="p-4" onClick={(e) => e.stopPropagation()}>
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
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
