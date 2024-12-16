import axiosInstanceUser from "@config/axiosInstanceUser";

export const fetchChatbotResponse = async (request) => {
  try {
    // Request payload
    const payload = { request };

    console.log("Request payload for chatbot:", payload);

    // Mengirim permintaan ke API
    const response = await axiosInstanceUser.post(`/chatbot`, payload);
    // Log respons dari API
    console.log("Chatbot response:", response.data);

    return response.data; // Mengembalikan data respons API
  } catch (error) {
    console.error(
      "Error fetching chatbot response:",
      error.response?.data || error.message
    );

    // Menampilkan pesan error yang lebih spesifik jika memungkinkan
    throw new Error(
      error.response?.data?.Message || "Failed to fetch chatbot response."
    );
  }
};

export const fetchUserChatbotResponses = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstanceUser.get(`/chatbot/user-responses`, {
      params: { page, limit },
    });

    // Log respons dari API
    console.log("User chatbot responses:", response.data);

    return response.data; // Mengembalikan data respons API
  } catch (error) {
    console.error(
      "Error fetching user chatbot responses:",
      error.response?.data || error.message
    );

    // Menampilkan pesan error yang lebih spesifik jika memungkinkan
    throw new Error(
      error.response?.data?.Message || "Failed to fetch user chatbot responses."
    );
  }
};
