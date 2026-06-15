import { useQuery } from "@tanstack/react-query";
import { siaMobileServices } from "@/services/siaMobileServices";
import { useAuthStore } from "@/store/useAuthStore";

export const useRiwayatStudi = () => {
  const nim = useAuthStore((state) => state.nim);

  return useQuery({
    queryKey: ["riwayatStudi", nim],
    queryFn: () =>
      siaMobileServices.getRiwayatStudi({
        Nim: nim,
      }),
    enabled: !!nim,
    staleTime: 1000 * 60 * 5,
  });
};