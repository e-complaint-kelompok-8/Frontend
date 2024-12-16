// components/UserDetail/UserDetailSkeleton.js
import React from "react";

const UserDetailSkeleton = () => {
  return (
    <div className="mx-auto lg:px-4 md:px-4 animate-pulse">
      {/* Tombol Kembali */}

      {/* Bagian Profil Pengguna */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-300 mb-4 sm:mb-0 sm:mr-6"></div>
          <div className="text-center sm:text-left w-full">
            <div className="h-6 bg-gray-300 w-1/2 mx-auto sm:mx-0 mb-3 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 w-3/4 mx-auto sm:mx-0 rounded"></div>
              <div className="h-4 bg-gray-300 w-2/3 mx-auto sm:mx-0 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      {/* Bagian Total Komplain */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
        <div className="h-6 bg-gray-300 w-1/3 mb-4 rounded"></div>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg text-center">
            <div className="h-8 bg-gray-300 w-1/2 mx-auto mb-2 rounded"></div>
            <div className="h-4 bg-gray-300 w-1/3 mx-auto rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-gray-100 p-3 sm:p-4 rounded-lg text-center"
            >
              <div className="h-8 bg-gray-300 w-1/2 mx-auto mb-2 rounded"></div>
              <div className="h-4 bg-gray-300 w-1/3 mx-auto rounded"></div>
            </div>
          ))}
        </div>
      </div>
      {/* Bagian Riwayat Komplain */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-300 w-1/3 rounded"></div>
          <div className="h-6 w-6 bg-gray-300 rounded"></div>
        </div>

        <div className="mt-4 space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start border-b pb-4">
              <div className="mr-4 mt-1 w-5 h-5 bg-gray-300 rounded"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 mr-2">
                    <div className="h-5 bg-gray-300 w-1/2 mb-2 rounded"></div>
                    <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
                  </div>
                  <div className="h-5 w-16 bg-gray-300 rounded"></div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="h-4 bg-gray-300 w-1/2 rounded"></div>
                  <div className="h-4 bg-gray-300 w-1/4 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetailSkeleton;
