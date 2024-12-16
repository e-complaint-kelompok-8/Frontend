// components/UserDetail/UserProfile.js
import React from "react";
import { Mail, Phone } from "lucide-react";

const UserProfile = ({ user }) => (
  <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
    <div className="flex flex-col sm:flex-row items-center">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
        {user.photo_url ? (
          <img
            src={user.photo_url}
            alt={user.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-2xl font-bold text-gray-700">
            {user.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="text-center sm:text-left">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
          {user.name}
        </h1>
        <div className="text-gray-500 space-y-1 mt-2 text-sm sm:text-base">
          <p className="flex items-center justify-center sm:justify-start">
            <Mail size={16} className="mr-2 text-gray-400" /> {user.email}
          </p>
          <p className="flex items-center justify-center sm:justify-start">
            <Phone size={16} className="mr-2 text-gray-400" /> {user.phone}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default UserProfile;
