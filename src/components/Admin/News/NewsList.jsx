// components/News/NewsList.js
import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import NewsService from "@services/Admin/NewsService";
import CategoryService from "@services/Admin/CategoryService";
import NewsTable from "./NewsTable";
import NewsCard from "./NewsCard";
import NewsModal from "./NewsModal";
import PublicServiceSkeleton from "./PublicServiceSkeleton";

import { usePagination } from "@hooks/Admin/usePagination";

const NewsList = () => {
  const [categories, setCategories] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [selectedNews, setSelectedNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);

  const limit = 10;
  const { currentPage, handlePageChange } = usePagination();
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getCategories();
        setCategories(response || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal mengambil data kategori",
        });
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchNews();
  }, [currentPage]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await NewsService.getAllNews(currentPage, limit);
      setNewsData(response.news || []);
      setTotalPages(response.total_pages || 1);
    } catch (error) {
      console.error("Error fetching news:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal mengambil data",
        text: "Terjadi kesalahan saat mengambil data berita",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredNewsData = useMemo(() => {
    return newsData.filter((news) =>
      news.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [newsData, searchTerm]);

  const handleDeleteNews = async () => {
    try {
      if (!selectedNews || selectedNews.length === 0) {
        throw new Error("Tidak ada berita yang dipilih");
      }

      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Berita yang dihapus tidak dapat dikembalikan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        setLoadingAction(true);
        await NewsService.deleteNews(selectedNews);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Berita berhasil dihapus",
          timer: 1500,
          showConfirmButton: false,
        });

        setSelectedNews([]);
        fetchNews();
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Gagal menghapus berita",
      });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteNewsCard = async (newsId) => {
    try {
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Berita yang dihapus tidak dapat dikembalikan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        setLoadingAction(true);
        await NewsService.deleteNews([newsId]);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Berita berhasil dihapus",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchNews();
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Gagal menghapus berita",
      });
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="md:max-w-6xl md:mx-auto md:px-4">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Berita Terkini</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Plus size={20} className="mr-2" />
            Tambah
          </button>
        </div>
      </div>
      {selectedNews.length > 0 && (
        <div className="bg-indigo-50 p-4 rounded-lg flex justify-between items-center mb-4">
          <p className="text-indigo-800">
            {selectedNews.length} berita dipilih
          </p>
          <button
            onClick={handleDeleteNews}
            className="flex items-center text-red-600 hover:bg-red-100 px-3 py-2 rounded-md transition-colors"
          >
            <Trash2 size={20} className="mr-2" />
            Hapus Terpilih
          </button>
        </div>
      )}
      {loading || loadingAction ? (
        <PublicServiceSkeleton />
      ) : (
        <>
          <NewsTable
            newsData={filteredNewsData}
            selectedNews={selectedNews}
            setSelectedNews={setSelectedNews}
            setIsUpdateModalOpen={setIsUpdateModalOpen}
            setSelectedNewsItem={setSelectedNewsItem}
            handleDeleteNews={handleDeleteNews}
          />
          <div className="sm:hidden">
            {filteredNewsData.map((news) => (
              <NewsCard
                key={news.id}
                news={news}
                setSelectedNewsItem={setSelectedNewsItem}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                handleDeleteNewsCard={handleDeleteNewsCard}
              />
            ))}
          </div>
        </>
      )}
      {!loading && newsData.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-6 pb-16 md:pb-8">
          <button
            onClick={() => handlePageChange(currentPage - 1, totalPages)}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            « Previous
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber, totalPages)}
                  className={`px-3 py-1 rounded ${
                    pageNumber === currentPage
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            } else if (
              pageNumber === currentPage - 2 ||
              pageNumber === currentPage + 2
            ) {
              return (
                <span key={pageNumber} className="px-2">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1, totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Next »
          </button>
        </div>
      )}
      {isAddModalOpen && (
        <NewsModal
          isOpen={isAddModalOpen}
          setIsOpen={setIsAddModalOpen}
          categories={categories}
          fetchNews={fetchNews}
          setLoadingAction={setLoadingAction}
        />
      )}
      {isUpdateModalOpen && (
        <NewsModal
          isOpen={isUpdateModalOpen}
          setIsOpen={setIsUpdateModalOpen}
          categories={categories}
          fetchNews={fetchNews}
          newsItem={selectedNewsItem}
          setLoadingAction={setLoadingAction}
        />
      )}
    </div>
  );
};

export default NewsList;