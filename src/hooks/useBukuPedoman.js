import { useQuery } from "@tanstack/react-query";
import { siaMobileServices } from "@/services/siaMobileServices";

export const useBukuPedoman = () => {
  return useQuery({
    queryKey: ["buku-pedoman"],
    queryFn: () => siaMobileServices.getBukuPedoman(),
    staleTime: 1000 * 60 * 5,
  });
};