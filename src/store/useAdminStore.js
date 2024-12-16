import { create } from "zustand";
import { persist } from "zustand/middleware";

import AdminService from "@services/Admin/AdminService";

const useAdminStore = create(
  persist(
    (set) => ({
      adminProfile: {
        email: "",
        role: "",
        photo: "",
      },
      setProfileData: (newProfileData) =>
        set((state) => ({
          adminProfile: {
            ...state.adminProfile,
            ...newProfileData,
          },
        })),
      fetchAdminProfile: async () => {
        try {
          const profile = await AdminService.getProfile();
          set({
            adminProfile: {
              email: profile.email || "",
              role: profile.role || "",
              photo: profile.photo || "",
            },
          });
        } catch (error) {
          console.error("Error fetching admin profile:", error);
        }
      },
      clearAuth: () =>
        set({ adminProfile: { email: "", role: "", photo: "" } }),
    }),
    {
      name: "admin-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAdminStore;
