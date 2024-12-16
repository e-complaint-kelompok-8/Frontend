// components/News/NewsTable.js
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FileImage, Pencil, Trash2 } from "lucide-react";

const NewsTable = ({
  newsData,
  selectedNews,
  setSelectedNews,
  setIsUpdateModalOpen,
  setSelectedNewsItem,
  handleDeleteNews,
}) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSelectNews = (id) => {
    setSelectedNews((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAllNews = () => {
    if (selectedNews.length === newsData.length) {
      setSelectedNews([]);
    } else {
      setSelectedNews(newsData.map((news) => news.id));
    }
  };

  return (
    <div className="md:bg-white md:shadow rounded-lg overflow-x-auto">
      <table className="w-full hidden sm:table">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-left">
              <input
                type="checkbox"
                checked={
                  newsData.length > 0 && selectedNews.length === newsData.length
                }
                onChange={(e) => {
                  e.stopPropagation();
                  handleSelectAllNews();
                }}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gambar
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Content
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kategori
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {newsData.map((news) => (
            <tr
              key={news.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/admin/news/${news.id}`)} // Navigate on row click
            >
              <td className="p-4" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedNews.includes(news.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSelectNews(news.id);
                  }}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
              </td>
              <td className="p-4">
                {news.photo_url ? (
                  <img
                    src={news.photo_url}
                    alt={news.title}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                    <FileImage className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </td>
              <td className="p-4">
                <div className="text-sm font-medium text-gray-900 line-clamp-2">
                  {news.title}
                </div>
                <div className="text-sm text-gray-500 line-clamp-1">
                  {news.content}
                </div>
              </td>
              <td className="p-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {news.category.name}
                </span>
              </td>
              <td className="p-4 text-sm text-gray-500">
                {new Date(news.date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </td>
              <td className="p-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      setSelectedNewsItem(news);
                      setIsUpdateModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 transition-colors"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => {
                      handleSelectNews(news.id); // Select the news
                      // handleDeleteNews([news.id]); // Delete the news
                    }}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default NewsTable;
