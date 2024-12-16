import { create } from "zustand";

export const useComplaintStore = create((set) => ({
  complaints: [],
  setComplaints: (complaints) => {
    console.log("Data complaints updated:", complaints); // Debugging
    set({ complaints });
  },
}));
