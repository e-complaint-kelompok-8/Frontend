import axios from "axios";
import useAuthStore from "@stores/useAuthStore"; // Asumsikan file Zustand Anda bernama authStore.js

// Base URL for the API
const BASE_URL = "https://elaporin.org";

class AuthService {
  // Register a new user
  static async register(userData) {
    try {
      const response = await axios.post(`${BASE_URL}/register`, userData);
      return response.data.user;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Verify OTP
  static async verifyOtp(otpData) {
    try {
      const response = await axios.post(`${BASE_URL}/verify-otp`, otpData);
      return response.data.message;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Login
  static async login(loginData) {
    try {
      const response = await axios.post(`${BASE_URL}/login`, loginData);

      // Dapatkan token dan role dari respons
      const { token, role } = response.data.user;

      // Update global state dengan Zustand

      useAuthStore.getState().setToken(token);

      return response.data.user;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Logout
  static logout() {
    // Clear token dan role dari Zustand
    useAuthStore.getState().clearAuth();

    // Hapus data user dari localStorage
    localStorage.removeItem("userData");
  }

  // Register Admin
  static async registerAdmin(userData) {
    try {
      const response = await axios.post(`${BASE_URL}/admin/register`, userData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Login Admin
  static async loginAdmin(adminData) {
    try {
      const response = await axios.post(`${BASE_URL}/admin/login`, adminData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get current user from localStorage
  static getCurrentUser() {
    const userDataString = localStorage.getItem("userData");
    return userDataString ? JSON.parse(userDataString) : null;
  }

  // Get authentication token dari Zustand
  static getToken() {
    return useAuthStore.getState().token;
  }

  // Get user role dari Zustand
  static getRole() {
    return useAuthStore.getState().role;
  }

  // Error handling utility
  static handleError(error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
  }

  // Utility method to create authenticated axios instance
  static createAuthenticatedInstance() {
    const token = this.getToken();
    return axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  }
}

export default AuthService;
