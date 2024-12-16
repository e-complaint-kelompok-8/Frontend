// components/UserDetail/TotalComplaints.js
import React from "react";

const TotalComplaints = ({ totalComplaints, complaintStatusCount }) => {
  const gridColumnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        Total Komplain
      </h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gray-100 p-3 sm:p-4 rounded-lg text-center">
          <p className="text-xl sm:text-2xl font-bold text-gray-800">
            {totalComplaints}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">Total Komplain</p>
        </div>
      </div>
      <div
        className={`grid ${
          gridColumnClasses[Object.keys(complaintStatusCount).length]
        } gap-4 mt-4`}
      >
        {Object.entries(complaintStatusCount).map(([status, count]) => (
          <div
            key={status}
            className="bg-gray-100 p-3 sm:p-4 rounded-lg text-center"
          >
            <p className="text-xl sm:text-2xl font-bold text-gray-800">
              {count}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 capitalize">
              {status === "in-progress"
                ? "Dalam Proses"
                : status === "resolved"
                ? "Selesai"
                : status === "open"
                ? "Batal"
                : status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalComplaints;
