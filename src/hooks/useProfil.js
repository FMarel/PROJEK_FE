import { useQuery } from "@tanstack/react-query";
import { siaMobileServices } from "@/services/siaMobileServices";
import { useAuthStore } from "@/store/useAuthStore";

export const useProfilMahasiswa = () => {
  const nim = useAuthStore((state) => state.nim);

  return useQuery({
    queryKey: ["profilMahasiswa", nim],
    queryFn: () =>
      siaMobileServices.getProfilMahasiswa({ Nim: nim }),
    enabled: !!nim,
    staleTime: 1000 * 60 * 5,
  });
};