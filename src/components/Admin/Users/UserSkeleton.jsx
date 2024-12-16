// components/Users/UserSkeleton.js
import React from "react";

const UserSkeleton = () => {
  const renderSkeletonCard = () => (
    <div className="rounded-lg md:p-4 mb-4 bg-white shadow-md animate-pulse">
      <div className="flex px-4 space-x-4">
        <div className="flex flex-col space-y-2 flex-1 pb-4">
          <div className="flex items-center justify-between mt-2">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            {/* <div className="h-5 w-5 bg-gray-200 rounded-full"></div> */}
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
      {/* <td className="p-4">
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
      </td> */}
      <td className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </td>
      {/* <td className="p-4">
        <div className="flex space-x-4">
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
        </div>
      </td> */}
    </tr>
  );

  return (
    <div className="md:max-w-6xl md:mx-auto ">
      {/* Desktop Table Skeleton */}
      <div className="md:bg-white md:shadow rounded-lg overflow-x-auto hidden sm:block">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {/* <th className="p-4 w-1/12">
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
              </th> */}
              <th className="p-4 text-left w-3/12">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </th>
              <th className="p-4 text-left w-3/12">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </th>
              <th className="p-4 text-left w-3/12">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </th>
              {/* <th className="p-4 text-left w-2/12">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </th> */}
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

export default UserSkeleton;
