// components/Complaint/Chatbot.js
import React, { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import ChatbotService from "@services/Admin/ChatBot";

const Chatbot = ({ toggleChatbot, complaintId }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const suggestionsResponse = await ChatbotService.getSuggestions(
          complaintId
        );
        const suggestions = suggestionsResponse.data || [];

        const historyResponse = await ChatbotService.getChatHistory(
          complaintId
        );
        const previousChats = historyResponse.data || [];

        const combinedHistory = [...suggestions, ...previousChats]
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .map((item) => ({
            sender: item.sender || "admin",
            text: item.text || item.response,
            timestamp: item.createdAt,
          }));

        setChatHistory(combinedHistory);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, [complaintId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: "admin",
      text: message,
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await ChatbotService.addSuggestion(complaintId, message);
      const botMessage = {
        sender: "bot",
        text: response?.data.response || "Tidak ada respon",
        timestamp: new Date().toISOString(),
      };

      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setMessage("");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderChatMessage = (chat, index) => {
    const isBot = chat.sender === "bot";
    const isAdmin = chat.sender === "admin";
    const isSystem = chat.sender === "system";

    let messageClasses = "p-3 rounded-lg shadow-md break-words relative";

    if (isBot) messageClasses += " bg-gray-200 text-gray-800";
    if (isAdmin) messageClasses += " bg-indigo-600 text-white";
    if (isSystem) messageClasses += " bg-yellow-100 text-yellow-800";

    return (
      <div
        key={index}
        className={`flex ${
          isBot || isSystem ? "justify-start" : "justify-end"
        } mb-3`}
      >
        <div
          className={`${messageClasses} ${isBot || isSystem ? "ml-2" : "mr-2"}`}
          style={{
            maxWidth: "80%",
            wordWrap: "break-word",
          }}
        >
          <ReactMarkdown
            className="text-sm"
            components={
              isBot || isSystem
                ? {
                    p: ({ node, children }) => (
                      <p style={{ marginBottom: "1rem" }}>{children}</p>
                    ),
                  }
                : undefined
            }
          >
            {typeof chat.text === "string"
              ? chat.text
                  .replace(/^"|"$/g, "")
                  .replace(/\\u0026/g, "&")
                  .replace(/\\n/g, "\n")
              : ""}
          </ReactMarkdown>
          <div
            className={`absolute w-0 h-full border-l-8 border-l-transparent border-r-8 border-r-transparent ${
              isBot || isSystem
                ? "border-b-8 border-b-gray-200 left-0"
                : "border-b-8 border-b-indigo-600 right-0"
            }`}
            style={{
              top: "0",
              transform:
                isBot || isSystem ? "translateX(-50%)" : "translateX(50%)",
            }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 md:hidden">
        <div className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden relative">
          <header className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 flex items-center gap-2">
            <div className="text-white flex-1">
              <h1 className="text-base font-semibold">Jarvis</h1>
              <p className="text-xs opacity-90">Chat Bot</p>
            </div>
            <button
              onClick={toggleChatbot}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          <div
            ref={chatContainerRef}
            className="overflow-y-auto bg-gray-50 h-[400px] p-2"
          >
            {chatHistory.map(renderChatMessage)}
            {isLoading && (
              <div className="relative flex justify-start mb-2">
                <div className="relative p-3 bg-gray-200 rounded-lg">
                  <span className="text-sm text-gray-600">Mengetik...</span>
                  <div
                    className={`absolute w-0 h-full border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-gray-200 left-0`}
                    style={{
                      top: "0",
                      transform: "translateX(-50%)",
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          <div className="p-2 bg-white border-t">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
              <input
                type="text"
                placeholder="Tuliskan Pesan Anda"
                className="flex-1 bg-transparent outline-none text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                className="bg-indigo-600 p-2 rounded-lg"
                disabled={isLoading || !message.trim()}
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 w-full max-w-sm md:max-w-md lg:max-w-lg bg-white shadow-lg rounded-lg p-2 hidden md:block">
        <header className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 flex items-center gap-2 rounded-t-lg">
          <div className="text-white flex-1">
            <h1 className="text-base font-semibold">Jarvis</h1>
            <p className="text-xs opacity-90">Chat Bot</p>
          </div>
          <button
            onClick={toggleChatbot}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div
          ref={chatContainerRef}
          className="overflow-y-auto bg-gray-50 h-[400px] p-2"
        >
          {chatHistory.map(renderChatMessage)}
          {isLoading && (
            <div className="relative flex justify-start mb-2 ml-2">
              <div className="relative p-3 bg-gray-200 rounded-lg">
                <span className="text-sm text-gray-600">Mengetik...</span>
                <div
                  className={`absolute w-0 h-full border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-gray-200 left-0`}
                  style={{
                    top: "0",
                    transform: "translateX(-50%)",
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-2 bg-white border-t">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
            <input
              type="text"
              placeholder="Tuliskan Pesan Anda"
              className="flex-1 bg-transparent outline-none text-sm"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              className="bg-indigo-600 p-2 rounded-lg"
              disabled={isLoading || !message.trim()}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
