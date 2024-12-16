// components/News/NewsSkeleton.js
import React from "react";

const NewsSkeleton = () => {
  return (
    <div className="min-h-screen lg:px-4 md:p-0">
      <div className="space-y-6 animate-pulse">
        {/* Image and Basic Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Skeleton */}
          <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 bg-gray-200 rounded-md"></div>

          {/* Form Fields - Desktop */}
          <div className="hidden md:grid grid-cols-1 gap-4">
            {/* Title Field */}
            <div className="space-y-2">
              <div className="w-16 h-5 bg-gray-200 rounded"></div>
              <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <div className="w-20 h-5 bg-gray-200 rounded"></div>
              <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
            </div>

            {/* Date Field */}
            <div className="space-y-2">
              <div className="w-20 h-5 bg-gray-200 rounded"></div>
              <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Form Fields - Mobile */}
        <div className="md:hidden space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
            <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
            <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
          </div>

          {/* Date Field */}
          <div className="space-y-2">
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
            <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Content Field */}
        <div className="space-y-2">
          <div className="w-16 h-5 bg-gray-200 rounded"></div>
          <div className="w-full h-32 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Update Button */}
        <div className="flex justify-end">
          <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Comments Section */}
        <div className="mt-6 p-4 bg-white rounded-md">
          <div className="flex justify-between items-center">
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSkeleton;
