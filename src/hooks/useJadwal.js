import { useState } from "react";
import { siaMobileServices } from "@/services/siaMobileServices";

export const useJadwal = () => {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJadwal = async (params) => {
  try {
    setLoading(true);

    console.log("PARAMS JADWAL:", params);

    const response = await siaMobileServices.getJadwal(params);

    console.log("JADWAL RESPONSE:", response);

    setJadwal(response?.data || []);
  } catch (error) {
    console.log("ERROR STATUS:", error?.response?.status);
    console.log("ERROR JADWAL:", error?.response?.data || error);
  } finally {
    setLoading(false);
  }
};

  return { jadwal, loading, fetchJadwal };

};