// components/UserDetail/ComplaintHistory.js
import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

const ComplaintHistory = ({
  sortedComplaints,
  renderComplaintIcon,
  getStatusColor,
  formatDate,
}) => {
  const [openHistoryDropdown, setOpenHistoryDropdown] = useState(false);

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpenHistoryDropdown(!openHistoryDropdown)}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Riwayat Komplain
        </h2>
        <ChevronRight
          className={`transition-transform duration-300 ${
            openHistoryDropdown ? "rotate-90" : ""
          }`}
        />
      </div>

      {openHistoryDropdown && (
        <div className="mt-4">
          {sortedComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="flex items-start border-b pb-4 last:border-b-0 mb-4"
            >
              <div className="mr-4 mt-1">
                {renderComplaintIcon(complaint.category)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 mr-2">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800">
                      {complaint.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {complaint.description}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getStatusColor(
                      complaint.status
                    )}`}
                  >
                    {complaint.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <p className="w-2/3">Lokasi: {complaint.location}</p>
                  <p className="flex-grow text-right">
                    {formatDate(complaint.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {sortedComplaints.length === 0 && (
            <p className="text-gray-500 text-center text-sm sm:text-base">
              Tidak ada riwayat komplain
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintHistory;
