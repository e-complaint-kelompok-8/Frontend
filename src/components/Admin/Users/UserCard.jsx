// components/Users/UserCard.js
import React from "react";
import { Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserCard = ({
  user,
  navigate,
  openUpdateModal,
  setSelectedUsers,
  handleDeleteUsers,
}) => {
  return (
    <div className="rounded-lg md:p-4 mb-4 bg-white shadow-md">
      <div className="flex px-4 space-x-4">
        <div
          className="flex flex-col space-y-2 flex-1 pb-4 relative cursor-pointer"
          onClick={() => navigate(`/admin/user/${user.id}`)}
        >
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2 pr-2">
              {user.name}
            </h3>

            {/* <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  openUpdateModal(user);
                }}
                className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
              >
                &#8942;
              </button>
            </div> */}
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500 flex items-center ">
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
};

export default UserCard;
