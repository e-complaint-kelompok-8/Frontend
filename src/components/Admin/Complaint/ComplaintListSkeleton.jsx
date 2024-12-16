// components/Complaint/ComplaintListSkeleton.js
import React from "react";

const ComplaintListSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <div key={item} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="mt-4">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 mt-6">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="w-8 h-8 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintListSkeleton;