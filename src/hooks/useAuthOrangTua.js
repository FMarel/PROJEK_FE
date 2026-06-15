import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { loginOrangTuaServices } from "@/services/LoginOrangTuaServices";

export const useAuthOrangTua = () => {
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginAction = async (username, password) => {
    try {
      setLoading(true);

      const loginData = await loginOrangTuaServices.login(username, password);

      console.log("Login Orang Tua Data:", loginData);

      if (loginData.token) {
        const permData = await loginOrangTuaServices.getPermission(
          loginData.nim, // ← pake NIM   dari login
          loginData.token,
        );

        console.log("Permission Data:", permData);

        if (permData.token) {
          setAuth({
            token: permData.token,           
            nama: loginData.nama,
            nim: loginData.nim,      
            role: "ROL23", // ← pastikan role diisi dengan benar 
            listAplikasi: loginData.listAplikasi || [],
            listPermission: permData.listPermission || [],
            listMenu: permData.listMenu || [],
          });

          return { success: true };
        }
      }

      return {
        success: false,
        message: loginData.errorMessage || "Login Gagal",
      };
    } catch (error) {
      console.error("Login Orang Tua Error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Username / Password tidak valid",
      };
    } finally {
      setLoading(false);
    }
  };

  return { loginAction, loading };
};