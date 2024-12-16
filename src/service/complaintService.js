import axiosInstanceUser from "@config/axiosInstanceUser";

export const createComplaint = async (data) => {
  try {
    console.log("Sending complaint data to backend:", data);
    const response = await axiosInstanceUser.post(`/complaint`, data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating complaint:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchComplaints = async (status = null, category = null) => {
  try {
    const response = await axiosInstanceUser.get(`/complaint`, {
      params: {
        status,
        category_id: category,
      },
    });

    console.log("Fetched complaints:", response.data);
    return response.data.data.complaints || [];
  } catch (error) {
    console.error(
      "Error fetching complaints:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchComplaintsByCategory = async (categoryId) => {
  if (!categoryId) {
    console.error("Category ID is required to fetch complaints.");
    return [];
  }

  try {
    const response = await axiosInstanceUser.get(
      `/complaint/category/${categoryId}`
    );

    console.log("Fetched complaints by category:", response.data);
    return response.data.complaints || [];
  } catch (error) {
    console.error(
      "Error fetching complaints by category:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchUserComplaints = async () => {
  try {
    const response = await axiosInstanceUser.get(`/complaint/user`);

    // Log data yang diterima untuk memastikan responsnya benar
    console.log("Fetched complaints:", response.data);

    // Periksa jika response.data memiliki struktur yang diharapkan
    if (response.data && response.data.complaints) {
      return response.data.complaints; // Mengembalikan array complaints jika ada
    } else {
      console.error("Tidak ada data keluhan di response");
      return []; // Kembalikan array kosong jika tidak ada data
    }
  } catch (error) {
    console.error(
      "Error fetching user complaints:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchComplaintsByStatus = async (status) => {
  try {
    const response = await axiosInstanceUser.get(
      `/complaint/status/${status || ""}`
    );
    // Periksa hasil respons untuk memastikan data yang diterima
    console.log("Fetched complaints:", response.data);
    return response.data.complaints; // Pastikan respons sesuai dan data.complaints ada
  } catch (error) {
    console.error(
      "Error fetching complaints by status:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchComplaintById = async (id) => {
  try {
    const response = await axiosInstanceUser.get(`/complaint/${id}`);

    console.log("API Response:", response.data); // Debugging response API
    return response.data.complaint; // Accessing the complaint data from the response object
  } catch (error) {
    console.error(
      "Error fetching complaint detail:",
      error.response?.data || error.message
    );

    if (error.response) {
      // Server responded with an error
      alert(
        `Error: ${error.response.status} - ${
          error.response.data?.message || "Unknown server error"
        }`
      );
    } else {
      // Network or other client-side issues
      alert(`Error: ${error.message}`);
    }

    throw error; // Rethrow the error to propagate it if needed
  }
};

export const fetchFeedbackComplaintByComplaintId = async (id) => {
  try {
    const response = await axiosInstanceUser.get(`/feedback/complaint/${id}`);

    console.log("API Response:", response.data); // Debugging respons API
    return response.data; // Pastikan response data sesuai format
  } catch (error) {
    console.error(
      "Error fetching complaint detail:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fungsi baru untuk membatalkan pengaduan
export const cancelComplaint = async (id, reason) => {
  try {
    const response = await axiosInstanceUser.put(`/complaint/${id}/cancel`, {
      reason,
    });
    console.log("Complaint canceled:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error canceling complaint:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fungsi untuk mengirim balasan berdasarkan feedback id
export const sendFeedbackResponse = async (feedbackId, responseContent) => {
  try {
    const response = await axiosInstanceUser.post(
      `/feedback/${feedbackId}/response`,
      { response: responseContent }
    );
    console.log("Feedback response sent:", response.data);
    return response.data; // Berisi pesan sukses dan data feedback terbaru
  } catch (error) {
    console.error(
      "Error sending feedback response:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchComplaintsByStatusAndCategory = async (status, category) => {
  try {
    // Menyusun query parameter berdasarkan filter
    const params = {};
    if (status) params.status = status; // Menambahkan status jika ada
    if (category) params.category_id = category; // Menggunakan category_id sebagai parameter

    const response = await axiosInstanceUser.get(`/complaint`, { params });

    // Log response untuk debugging
    console.log("Fetched complaints by status and category:", response.data);

    // Periksa jika response memiliki struktur data yang diharapkan
    if (response.data && response.data.complaints) {
      return response.data.complaints; // Mengembalikan array complaints
    } else {
      console.error("Tidak ada data keluhan di response");
      return []; // Mengembalikan array kosong jika tidak ada data
    }
  } catch (error) {
    console.error(
      "Error fetching complaints by status and category:",
      error.response?.data || error.message
    );
    return []; // Mengembalikan array kosong jika terjadi error
  }
};
