import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchNews } from "@services/newsService";

const NewsSection = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [news, setNews] = useState([]); // State untuk menyimpan berita
  const [error, setError] = useState(null); // State untuk error handling

  const handleCardClick = (route) => {
    navigate(`/pengaduan/${route}`);
  };

  useEffect(() => {
    const getNews = async () => {
      try {
        const fetchedNews = await fetchNews();
        setNews(fetchedNews);
      } catch (err) {
        setError("Gagal memuat berita. Silakan coba lagi.");
      }
    };

    getNews();
  }, []);

  const limitedNews = news.slice(0, 4); // Batasi jumlah berita

  return (
    <>
      <section>
        <div className="mb-6 flex items-center justify-center">
          <h2 className="text-xl font-bold">Berita Terkini</h2>
        </div>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {limitedNews.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md "
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.photo_url}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mb-1 font-medium">{item.title}</h3>
                  <p className="mb-2 text-sm text-gray-600">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 text-sm flex-grow">
                    {item.content.substring(0, 200)}...
                  </p>
                  <button
                    onClick={() => handleCardClick(news.id)}
                    className="text-sm text-primary hover:underline"
                  >
                    Lihat selengkapnya →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mb-6 mt-8 flex items-center justify-end ">
          <button
            onClick={() => navigate(`/user/berita`)}
            className="text-sm text-primary"
          >
            Lihat lainnya →
          </button>
        </div>
      </section>
    </>
  );
};

export default NewsSection;
