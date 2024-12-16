// components/Complaint/EmptyDataState.js
import React from "react";
import { Search } from "lucide-react";

const EmptyDataState = ({ type = "category", onRetry, message }) => {
  const renderIcon = () => (
    <div className="text-indigo-500 mb-4">
      <Search className="w-16 h-16 mx-auto" />
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50 rounded-lg shadow-lg p-8 text-center border border-gray-200">
      {renderIcon()}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {message || `Tidak ada ${type === "category" ? "Kategori" : "Status"}`}
      </h2>
      <p className="text-gray-600 text-sm mb-4">
        Tidak ada data yang tersedia untuk dipilih.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center justify-center px-5 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-transform transform hover:scale-105"
        >
          Muat Ulang
        </button>
      )}
    </div>
  );
};

export default EmptyDataState;
