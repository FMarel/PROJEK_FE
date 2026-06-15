import api from "@/api/axiosInstance";

export const siaMobileServices = {
  // Dashboard
 getDashboard: async (params) => {
  console.log("📤 Request Dashboard:", params);
  const response = await api.get("SiaMobile/dashboard", { params });
  console.log("📥 Response Dashboard:", response.data);
  return response.data;
},

  // Profil Mahasiswa
  getProfilMahasiswa: async (params) => {
    const response = await api.get("SiaMobile/GetProfilMahasiswa", { params });
    return response.data;
  },

  // Performa
  getPerformaIP: async (params) => {
    const response = await api.get("SiaMobile/performa-ip", { params });
    return response.data;
  },

  getPerformaKehadiran: async (params) => {
    const response = await api.get("SiaMobile/performa-kehadiran", { params });
    return response.data;
  },

  getPerformaJamPlusMinus: async (params) => {
    const response = await api.get("SiaMobile/performa-jam-plus-minus", { params });
    return response.data;
  },

  getPerformaPelanggaran: async (params) => {
    const response = await api.get("SiaMobile/performa-pelanggaran", { params });
    return response.data;
  },

  // Keuangan
  getTagihan: async (params) => {
    const response = await api.get("SiaMobile/tagihan", { params });
    return response.data;
  },

  getVirtualAccount: async (params) => {
    const response = await api.get("SiaMobile/virtual-account", { params });
    return response.data;
  },

  // Informasi
 getAllInformasi: async (params) => {
  try {
    console.log("📤 Request Informasi:", params);
    const response = await api.get("SiaMobile/informasi", { params });
    console.log("📥 Response Informasi:", response.data);
    return response.data;
  } catch (error) {
    console.log("❌ Error Informasi:", error.response?.status);
    console.log("❌ Error Data:", error.response?.data);
    throw error;
  }
},

  getDetailInformasi: async (id) => {
    const response = await api.get(`SiaMobile/informasi/${id}`);
    return response.data;
  },

  setBacaInformasi: async (payload) => {
    const response = await api.post("SiaMobile/informasi/baca", payload);
    return response.data;
  },

  // Riwayat
  getRiwayatKuliah: async (params) => {
    const response = await api.get("SiaMobile/riwayat-kuliah", { params });
    return response.data;
  },

  getRiwayatStudi: async (params) => {
    const response = await api.get("SiaMobile/riwayat-studi", { params });
    return response.data;
  },

  // Jadwal
  getJadwal: async (params) => { 
    const response = await api.get("SiaMobile/jadwal-perkuliahan", { params });
    return response.data;
  },
  
 getJadwalDetail: async (id, params) => {
    const response = await api.get(`SiaMobile/jadwal-perkuliahan/${id}`, { params });
    return response.data;
  },

  // Kalender Akademik
  getKalenderAkademik: async (params) => {
    const response = await api.get("SiaMobile/kalender-akademik", { params });
    return response.data;
  },

  // RPS
  getRps: async (params) => {
    const response = await api.get("SiaMobile/rps", { params });
    return response.data;
  },

  getRpsDetail: async (params) => {
    const response = await api.get("SiaMobile/rps-detail", { params });
    return response.data;
  },

  getRpsHeader: async (params) => {
    const response = await api.get("SiaMobile/rps-header", { params });
    return response.data;
  },

  // IMP
  getImp: async (params) => {
    const response = await api.get("SiaMobile/imp", { params });
    return response.data;
  },

  // Buku Pedoman
getBukuPedoman: async () => {
  const response = await api.get("SiaMobile/buku-pedoman");
  return response.data;
},
};