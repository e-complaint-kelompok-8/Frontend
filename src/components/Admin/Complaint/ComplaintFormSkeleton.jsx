// components/Complaint/ComplaintFormSkeleton.js
import React from "react";

const ComplaintFormSkeleton = () => {
  return (
    <div className="min-h-screen md:p-0 pb-24 md:pb-6">
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <div className="flex justify-between items-start mb-4 md:mb-6">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full animate-pulse"></div>
            <div>
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        <div className="mb-4">
          <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="mb-8">
          <div className="hidden md:grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
          <div className="md:hidden aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        <div className="border-t pt-4 md:pt-6">
          <div className="w-24 h-5 bg-gray-200 rounded animate-pulse mb-3 md:mb-4"></div>
          <div className="w-full h-32 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
          <div className="flex space-x-4">
            <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="mt-6">
          <div className="w-40 h-5 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="space-y-4">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="w-1/3 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintFormSkeleton;
