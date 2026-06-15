import { useQuery } from "@tanstack/react-query";
import { siaMobileServices } from "@/services/siaMobileServices";
import { useAuthStore } from "@/store/useAuthStore";

export const usePerformaIP = () => {
  const nim = useAuthStore((state) => state.nim);

  return useQuery({
    queryKey: ["performaIP", nim],
    queryFn: () => siaMobileServices.getPerformaIP({ Nim: nim }),
    enabled: !!nim,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePerformaKehadiran = () => {
  const nim = useAuthStore((state) => state.nim);

  return useQuery({
    queryKey: ["performaKehadiran", nim],
    queryFn: () => siaMobileServices.getPerformaKehadiran({ Nim: nim }),
    enabled: !!nim,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePerformaJamPlusMinus = () => {
  const nim = useAuthStore((state) => state.nim);

  return useQuery({
    queryKey: ["performaJamPlusMinus", nim],
    queryFn: () => siaMobileServices.getPerformaJamPlusMinus({ Nim: nim }),
    enabled: !!nim,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePerformaPelanggaran = () => {
  const nim = useAuthStore((state) => state.nim);

  return useQuery({
    queryKey: ["performaPelanggaran", nim],
    queryFn: () => siaMobileServices.getPerformaPelanggaran({ Nim: nim }),
    enabled: !!nim,
    staleTime: 1000 * 60 * 5,
  });
};