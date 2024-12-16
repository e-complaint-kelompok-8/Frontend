"use client";

import React, { useState, useEffect } from "react";
import {
  Cat,
  ChevronRight,
  Paperclip,
  Send,
  MessageCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown"; // Tambahkan react-markdown
import {
  fetchChatbotResponse,
  fetchUserChatbotResponses,
} from "@services/chatBotService"; // Pastikan import fungsi API

const LapiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // Menyimpan percakapan
  const [loading, setLoading] = useState(false);

  const menuOptions = [
    { id: 1, text: "Cara Mengajukan Pengaduan" },
    { id: 2, text: "Cara Melihat Status Pengaduan" },
    { id: 3, text: "Cara Membaca Berita dan Pengumuman" },
    { id: 4, text: "Cara Membatalkan Pengaduan" },
  ];

  // Toggle chat window
  const toggleChat = () => setIsOpen(!isOpen);

  // Handle parsing & formatting bot response
  const formatResponse = (text) => {
    try {
      // Parse jika terdapat karakter escape
      return JSON.parse(text);
    } catch {
      return text
        .replace(/\\n/g, "\n") // Ganti "\n" dengan newline
        .replace(/\\"/g, '"') // Ganti \" dengan "
        .replace(/\\\\/g, "\\"); // Ganti "\\" dengan "\"
    }
  };

  // Handle sending user input
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Reset input

    try {
      setLoading(true);
      const response = await fetchChatbotResponse(input); // Panggil API chatbot
      const botMessage = {
        sender: "bot",
        text: formatResponse(
          response?.Data?.response || "Maaf, saya tidak dapat menjawab."
        ),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Terjadi kesalahan. Coba lagi nanti." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle menu option click
  const handleMenuOption = async (option) => {
    setInput(option.text);
    await handleSendMessage();
  };

  // Fetch previous conversations (if any)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await fetchUserChatbotResponses(1, 10); // Ambil 10 percakapan terakhir
        const historyMessages = data.data
          .map((entry) => [
            { sender: "user", text: entry.request },
            { sender: "bot", text: formatResponse(entry.response) },
          ])
          .flat();
        setMessages(historyMessages);
      } catch (error) {
        console.error("Failed to fetch conversation history:", error);
      }
    };

    if (isOpen) fetchHistory();
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[600px] bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#4338ca] text-white p-4 flex items-center gap-3 rounded-xl border-white border-4 shadow-lg">
            <div className="bg-white p-1.5 rounded-full">
              <Cat className="w-6 h-6 text-[#4338ca]" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Lapi</h3>
              <p className="text-sm opacity-90">Chat Bot</p>
            </div>
          </div>

          {/* Chat Content */}
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {/* Today Label */}
            {/* <div className="flex justify-center">
              <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
                Hari Ini
              </span>
            </div> */}

            {/* Bot Welcome Message */}
            <div className="flex gap-3">
              <div className="bg-white h-10 p-2 rounded-full border">
                <Cat className="w-6 h-6 text-[#4338ca]" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <p className="text-gray-800">
                  Halo, Saya Lapi! Ada yang bisa saya bantu hari ini? Saya di
                  sini untuk membantu Anda melaporkan masalah atau mencari
                  informasi. Yuk, sampaikan kebutuhan Anda, Lapi siap membantu!
                </p>
              </div>
            </div>

            {/* Menu Options */}
            {!loading && !messages.length && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 max-w-[80%] ml-14 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div>
                    <MessageCircle className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="font-medium">
                    Silahkan Pilih Topik Yang Ingin Kamu Tanyakan:
                  </p>
                </div>
                {menuOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleMenuOption(option)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <span>{option.text}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.sender === "user" ? "justify-end" : ""
                }`}
              >
                {/* Icon hanya untuk bot */}
                {message.sender === "bot" && (
                  <div className="bg-white h-10 p-2 rounded-full border">
                    <Cat className="w-6 h-6 text-[#4338ca]" />
                  </div>
                )}
                {/* Pesan */}
                <div
                  className={`${
                    message.sender === "user"
                      ? "bg-[#4338ca] text-white"
                      : "bg-gray-100 text-gray-800"
                  } rounded-lg p-3 max-w-[80%]`}
                >
                  {message.sender === "bot" ? (
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  ) : (
                    <p>{message.text}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t p-4 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tuliskan Pesan Anda"
                className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
              />
              <button
                onClick={handleSendMessage}
                className="bg-[#4338ca] text-white p-2 rounded-lg hover:bg-[#3730a3] transition-colors"
                disabled={loading}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className="bg-[#4338ca] text-white rounded-full p-3 shadow-lg hover:bg-[#3730a3] transition-colors"
      >
        <Cat className="w-6 h-6" />
      </button>
    </div>
  );
};

export default LapiChatbot;
