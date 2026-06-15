import { useQuery } from "@tanstack/react-query";
import { siaMobileServices } from "@/services/siaMobileServices";
import { useAuthStore } from "@/store/useAuthStore";

export const useRiwayatKuliah = () => {
  const nim = useAuthStore((state) => state.nim);

  return useQuery({
    queryKey: ["riwayatKuliah", nim],
    queryFn: () =>
      siaMobileServices.getRiwayatKuliah({
        Nim: nim,
      }),
    enabled: !!nim,
    staleTime: 1000 * 60 * 5,
  });
};