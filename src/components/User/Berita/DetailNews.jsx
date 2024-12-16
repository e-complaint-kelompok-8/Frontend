import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Send, ChevronRight } from "lucide-react";
import { fetchNewsDetail } from "@services/newsService"; // Sesuaikan path
import { addComment } from "@services/newsService"; // Sesuaikan path

const DetailNews = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]); // State untuk komentar
  const [newComment, setNewComment] = useState(""); // State untuk komentar baru
  const [showAllComments, setShowAllComments] = React.useState(false);

  useEffect(() => {
    const loadNewsDetail = async () => {
      try {
        setLoading(true);
        const data = await fetchNewsDetail(id);
        setNews(data);
        setComments(data.comments || []); // Inisialisasi komentar jika tersedia
      } catch (err) {
        setError("Failed to load news details.");
      } finally {
        setLoading(false);
      }
    };

    loadNewsDetail();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("Komentar tidak boleh kosong.");
      return;
    }

    try {
      const comment = await addComment(id, newComment);
      setComments((prev) => [...prev, comment]); // Tambahkan komentar ke daftar
      setNewComment(""); // Reset input komentar
    } catch (err) {
      console.error(
        "Failed to add comment:",
        err.response?.data || err.message
      );
      alert(
        `Gagal menambahkan komentar: ${
          err.response?.data?.message || "Coba lagi nanti."
        }`
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 ">
      <div className="w-full max-w-[1440px] px-4 md:px-12">
        <div
          className=" flex items-start gap-2 mb-4 mt-8 cursor-pointer"
          onClick={() => navigate(-2)}
        >
          <ChevronLeft
            size={24}
            className="text-gray-700 hover:text-gray-900"
          />
          <h2 className="text-lg font-medium text-gray-700 hover:text-gray-900">
            Kembali
          </h2>
        </div>
        <main className="flex-grow self-center mx-auto max-w-7xl py-6">
          {news && (
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg">
              <div className="md:p-8 p-6 grid  gap-x-4 grid-cols md:grid-cols-[3fr,4fr]">
                <img
                  src={news.photo_url}
                  alt={news.title}
                  className="rounded-lg  h-80 object-cover"
                />
                <div>
                  <div className="flex items-center justify-between mb-4 md:mt-0 mt-4">
                    <span className="text-red-500 font-medium">
                      {news.category.name}
                    </span>
                    <div className="flex items-center gap-4">
                      <button className="hover:text-red-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      </button>
                      <button className="hover:text-gray-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                          />
                        </svg>
                      </button>
                      <button className="hover:text-gray-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <h2 className="text-xl md:text-3xl font-bold mb-4">
                    {news.title}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600 ">
                    <span>{new Date(news.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>By {news.admin.email}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 md:px-8 pb-8 md:pt-4">
                <p className="text-gray-500 md:text-xl text-base">
                  {news.content}
                </p>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="my-7 p-6 max-w-6xl mx-auto bg-white rounded-2xl shadow-lg">
            <h3 className="text-2xl text-center font-semibold text-gray-800 mb-4">
              Komentar
            </h3>
            <div className="relative flex items-center w-full rounded-lg mb-6">
              <input
                type="text"
                placeholder="Ketikan Komentar Anda Disini!"
                className="w-full px-4 py-3 border-none text-gray-700 rounded-lg focus:outline-none bg-slate-100"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Send
                className="absolute h-10 w-10 right-2 p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                onClick={handleAddComment}
                aria-label="Submit comment"
              />
            </div>

            {comments.length > 0 ? (
              <div>
                {/* Menampilkan komentar terbaru jika showAllComments false */}
                {!showAllComments && (
                  <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50 shadow-sm">
                    <span className="text-sm text-gray-500">
                      {comments[0].user?.name || "Anonymous"} -{" "}
                      {new Date(comments[0].created_at).toLocaleDateString(
                        "id-ID"
                      )}
                    </span>
                    <p className="text-base text-gray-700">
                      {comments[0].content}
                    </p>
                  </div>
                )}

                {/* Semua komentar jika showAllComments true */}
                {showAllComments && (
                  <ul className="mt-4 space-y-4">
                    {comments.map((comment, index) => (
                      <li
                        key={comment.id}
                        className="border-b border-gray-200 py-3 flex flex-col gap-2"
                      >
                        <p className="text-base text-gray-700">
                          {comment.content}
                        </p>
                        <span className="text-xs text-gray-500">
                          {comment.user?.name || "Anonymous"} -{" "}
                          {new Date(comment.created_at).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tombol Lihat Lebih Banyak / Tutup */}
                <div className="flex justify-end">
                  <button
                    className="text-blue-500 hover:underline text-sm font-medium mt-4"
                    onClick={() => setShowAllComments((prev) => !prev)}
                  >
                    {showAllComments ? "Tutup" : "Lihat lebih banyak komentar"}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center">Belum ada komentar.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DetailNews;
