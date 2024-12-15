import axiosInstance from "@config/axiosConfig";

const ChatbotService = {
  // Menambahkan saran
  addSuggestion: async (complaintId, request) => {
    console.log("id", complaintId);
    console.log("request", request);
    try {
      const response = await axiosInstance.post("/ai-suggestions", {
        complaint_id: parseInt(complaintId),
        request: request.trim(),
      });
      console.log("response", response);
      return response.data; // Mengembalikan data dari respons
    } catch (error) {
      throw error; // Melempar error jika terjadi kesalahan
    }
  },

  // Mengikuti saran
  followUpSuggestion: async (id, followUpRequest) => {
    try {
      const response = await axiosInstance.post(
        `/ai-suggestions/${id}/follow-up`,
        {
          follow_up_request: followUpRequest.trim(),
        }
      );
      return response.data; // Mengembalikan data dari respons
    } catch (error) {
      throw error; // Melempar error jika terjadi kesalahan
    }
  },

  // Mengambil semua saran
  getSuggestions: async () => {
    try {
      const response = await axiosInstance.get("/ai-suggestions");
      return response.data;
    } catch (error) {
      throw error; // Melempar error jika terjadi kesalahan
    }
  },
};

export default ChatbotService;
