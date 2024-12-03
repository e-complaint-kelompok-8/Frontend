import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      email: null,
      setToken: (token) => set({ token }),
      setEmail: (email) => set({ email }),
      clearAuth: () => set({ token: null }),
      getUserIdFromToken: () => {
        const token = get().token;
        if (token) {
          try {
            const decoded = jwtDecode(token);
            return decoded.user_id; // Pastikan `user_id` sesuai dengan nama properti di payload JWT Anda
          } catch (error) {
            console.error("Invalid token:", error);
            return null;
          }
        }
        return null;
      },
    }),

    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
