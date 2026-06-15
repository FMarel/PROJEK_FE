import { useQuery } from "@tanstack/react-query";
import { siaMobileServices } from "@/services/siaMobileServices";
import { useAuthStore } from "@/store/useAuthStore";

export const useRpsDetail = (rpsId, kelas) => {
  const nim = useAuthStore((state) => state.nim);
  const role = useAuthStore((state) => state.role);

  const header = useQuery({
    queryKey: ["rps-header", rpsId],
    queryFn: async () => {
      const res = await siaMobileServices.getRpsHeader({ RpsId: rpsId });
      return res; // Pastikan service mengembalikan data bersih
    },
    enabled: !!rpsId,
    staleTime: 1000 * 60 * 5,
  });

  const details = useQuery({
    queryKey: ["rps-detail", rpsId, kelas, nim],
    queryFn: async () => {
      const res = await siaMobileServices.getRpsDetail({ 
        RpsId: rpsId, 
        Kelas: kelas || "", 
        Username: nim,
        Role: role || "ROL006"
      });
      // Berdasarkan screenshot Swagger, API mengembalikan Array
      return Array.isArray(res) ? res : (res?.data || []);
    },
    enabled: !!rpsId && !!nim,
    staleTime: 1000 * 60 * 5,
  });

  return {
    header: header.data,
    details: details.data,
    isLoading: header.isLoading || details.isLoading,
    isError: header.isError || details.isError,
    refetch: () => {
      header.refetch();
      details.refetch();
    }
  };
};