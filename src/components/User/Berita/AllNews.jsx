import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchNews } from "@services/newsService"; // Import the fetchNews service

const AllNews = () => {
  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const loadNews = async () => {
      try {
        const fetchedNews = await fetchNews();
        setNews(fetchedNews);
        setLoading(false);
      } catch (err) {
        setError("Failed to load news.");
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const totalPages = Math.ceil(news.length / itemsPerPage);
  const currentNews = news.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow flex justify-center items-center  py-8">
        <div className=" w-full max-w-[1440px] px-12">
          <div>
            <h1 className="text-2xl font-bold mb-8">Berita Terkini</h1>

            {/* Loading state */}
            {loading && <p>Loading news...</p>}

            {/* Error state */}
            {error && <p className="text-red-500">{error}</p>}

            {/* News articles */}
            {!loading && !error && (
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 items-center justify-center">
                {currentNews.map((article) => (
                  <article
                    key={article.id}
                    className="flex flex-col shadow-lg bg-white rounded-xl overflow-hidden cursor-pointer"
                    style={{ maxWidth: "314px", minHeight: "400px" }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={article.photo_url}
                        alt={article.title}
                        style={{ maxWidth: "314px", maxHeight: "146px" }}
                        className="h-64 w-full object-cover object-top transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col">
                      <h2 className="text-base font-bold hover:text-gray-700 pb-1">
                        {article.title}
                      </h2>
                      <p className="text-sm text-gray-600 pb-4">
                        {new Date(article.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700 text-sm flex-grow">
                        {article.content.substring(0, 100)}...
                      </p>
                      <a
                        href="#"
                        onClick={() =>
                          navigate(`/user/berita/detail/${article.id}`)
                        }
                        className="text-blue-600 mb-auto text-xs font-bold mt-auto hover:text-blue-800 inline-block"
                      >
                        Info Selanjutnya
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-4">
                <button
                  onClick={() => handlePagination(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePagination(index + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-700 hover:bg-blue-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePagination(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllNews;
