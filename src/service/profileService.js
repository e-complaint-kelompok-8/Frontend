import axiosInstanceUser from "@config/axiosInstanceUser";

export const fetchUserProfile = async () => {
  try {
    const response = await axiosInstanceUser.get(`/user/profile`);
    console.log("Fetched user profile:", response.data);
    return response.data; // Pastikan response memiliki struktur data profil yang diharapkan
  } catch (error) {
    console.error(
      "Error fetching user profile:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateName = async (newName) => {
  try {
    const response = await axiosInstanceUser.put(`/user/profile/name`, {
      name: newName,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating name:", error.response || error);
    throw error;
  }
};

// Fungsi untuk mengupdate password pengguna
export const updatePassword = async (oldPassword, newPassword) => {
  try {
    const response = await axiosInstanceUser.put(`/user/profile/password`, {
      old_password: oldPassword,
      new_password: newPassword,
    });
    console.log("Password updated successfully:", response.data);
    return response.data; // Kembalikan respons yang sesuai dari server
  } catch (error) {
    console.error(
      "Error updating password:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fungsi untuk update foto profil
export const updatePhotoProfile = async (photoFile) => {
  try {
    const formData = new FormData();
    formData.append("photo", photoFile); // Menambahkan file foto ke formData

    const response = await axiosInstanceUser.put(
      `/user/profile/photo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Profile photo updated successfully:", response.data);
    return response.data; // Mengembalikan data response API
  } catch (error) {
    console.error(
      "Error updating photo:",
      error.response?.data || error.message
    );
    throw error; // Mengembalikan error jika terjadi masalah
  }
};
