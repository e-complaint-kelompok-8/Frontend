import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      role: null,
      user: null,
      email: null,
      setToken: (token) => set({ token }),
      setRole: (role) => set({ role }),
      setUser: (user) => set({ user }),
      setEmail: (email) => set({ email }), // New method to set email
      clearEmail: () => set({ email: null }), // New method to clear email
      clearAuth: () =>
        set({ token: null, role: null, user: null, email: null }), // Updated to clear email as well
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
