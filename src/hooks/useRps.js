import { useQuery } from "@tanstack/react-query";
import { siaMobileServices } from "@/services/siaMobileServices";
import { useAuthStore } from "@/store/useAuthStore";

export const useRps = (status = "Final") => {
  const nim = useAuthStore((state) => state.nim);
  const role = useAuthStore((state) => state.role);

  return useQuery({
    queryKey: ["rps", nim, role, status],
    queryFn: async () => {
      const response = await siaMobileServices.getRps({
        Username: nim,
        Role: role || "ROL006",
        Status: status,
        OrderBy: "mku_nama",
      });
      
      // Axios biasanya me-return data di dalam response.data
      // Tapi karena siaMobileServices anda sudah melakukan return response.data,
      // kita cukup pastikan formatnya array.
      return Array.isArray(response) ? response : (response?.data || []);
    },
    enabled: !!nim,
    staleTime: 1000 * 60 * 5,
  });
};