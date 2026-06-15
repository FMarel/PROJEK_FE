import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      nama: null,
      nim: null, 
      role: null,
      listAplikasi: [],
      isAuthenticated: false,
      _hasHydrated: false,

      setAuth: (data) =>
        set({
          token: data.token,
          nama: data.nama,
          nim: data.nim,
          role: data.role,
          listAplikasi: data.listAplikasi,
          isAuthenticated: true,
          listPermission: data.listPermission || [],
        }),

      logout: () =>
        set({
          token: null,
          nama: null,
          nim: null,
          role: null,
          listAplikasi: [],
          isAuthenticated: false,
          listPermission: [],
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.role && state.token) {
            state.role = "ROL23"; // Pastikan role diisi dengan benar untuk orang tua
             }
          state._hasHydrated = true;
        }
      },
    },
  ),
);