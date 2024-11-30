import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      role: null,
      setToken: (token) => set({ token }),
      setRole: (role) => set({ role }),
      clearAuth: () => set({ token: null, role: null }), // Untuk logout
    }),
    {
      name: "auth-storage", // Nama key untuk localStorage
    }
  )
);

export default useAuthStore;
