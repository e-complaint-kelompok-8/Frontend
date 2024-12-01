import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      role: null,
      user: null, // Tambahan untuk menyimpan data user secara lengkap
      setToken: (token) => set({ token }),
      setRole: (role) => set({ role }),
      setUser: (user) => set({ user }), // Metode untuk set user
      clearAuth: () => set({ token: null, role: null, user: null }), // Reset semua data
    }),
    {
      name: "auth-storage", // Nama key untuk localStorage
    }
  )
);

export default useAuthStore;
