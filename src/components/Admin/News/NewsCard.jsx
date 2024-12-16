// components/News/NewsCard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileImage } from "lucide-react";

const NewsCard = ({
  news,
  setSelectedNewsItem,
  setIsUpdateModalOpen,
  handleDeleteNewsCard, // Use the new handleDeleteNewsCard function
}) => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleNewsItemClick = (newsId) => {
    navigate(`/admin/news/${newsId}`);
  };

  return (
    <div className="rounded-lg md:p-4 mb-4 bg-white shadow-md" key={news.id}>
      {/* Image Section - Clickable */}
      <div onClick={() => handleNewsItemClick(news.id)}>
        {news.photo_url ? (
          <img
            src={news.photo_url}
            alt={news.title}
            className="w-full h-40 object-cover rounded-md mb-4"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
            <FileImage className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex px-4 space-x-4">
        <div className="flex flex-col space-y-2 flex-1 pb-4 relative">
          {/* Title and Dropdown */}
          <div className="flex items-center justify-between">
            <h3
              className="text-base font-semibold text-gray-900 line-clamp-2 pr-2 cursor-pointer"
              onClick={() => handleNewsItemClick(news.id)}
            >
              {news.title}
            </h3>

            {/* Dropdown Trigger */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setActiveDropdown(
                    activeDropdown === news.id ? null : news.id
                  );
                }}
                className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
              >
                &#8942;
              </button>

              {/* Dropdown Menu */}
              {activeDropdown === news.id && (
                <div className="absolute z-10 right-0 top-[100%] w-48 bg-white border rounded-md shadow-lg">
                  <button
                    onClick={() => {
                      setSelectedNewsItem(news); // Set the selected news item
                      setIsUpdateModalOpen(true); // Open the update modal
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteNewsCard(news.id); // Use the new handleDeleteNewsCard function
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Other content - Clickable */}
          <div
            onClick={() => handleNewsItemClick(news.id)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-800">
                {news.category.name}
              </span>

              <span>
                {new Date(news.date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <p className="text-sm text-gray-500 line-clamp-2">{news.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
