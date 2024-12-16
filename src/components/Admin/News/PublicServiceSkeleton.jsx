// components/News/PublicServiceSkeleton.js
import React from "react";

const PublicServiceSkeleton = () => {
  return (
    <div className="w-full">
      <div className="hidden md:grid md:grid-cols-[40px_100px_1fr_150px_150px_100px] gap-4 px-4 py-3 border-b">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-5"></div>
        <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="hidden md:block">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[40px_1fr] md:grid-cols-[40px_100px_1fr_150px_150px_100px] gap-4 items-center px-4 py-4 border-b hover:bg-gray-50"
          >
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="hidden md:block">
              <div className="w-[80px] h-[80px] bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="md:hidden w-[80px] h-[80px] bg-gray-200 rounded-lg animate-pulse mb-3"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            </div>
            <div className="hidden md:block">
              <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden md:block">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
            </div>
            <div className="hidden md:flex space-x-2">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="md:hidden">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden mb-4">
            <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="h-7 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicServiceSkeleton;
