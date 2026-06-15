import api from "@/api/axiosInstance";

export const loginOrangTuaServices = {
  login: async (username, password) => {
    const response = await api.post("AuthOrangTua/login", {
      username,
      password,
      jenisAplikasi: "Mobile", 
    });
    return response.data;
  },
  
  getPermission: async (username, token) => {
    const response = await api.post(
      "AuthOrangTua/getpermission",
      {
        username: "orangtua",
        appId: "APP06",
        roleId: "ROL023",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },
};