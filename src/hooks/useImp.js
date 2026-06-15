import { useQuery } from "@tanstack/react-query";
import { siaMobileServices } from "@/services/siaMobileServices";
import { useAuthStore } from "@/store/useAuthStore";

export const useImp = () => {
  const nim  = useAuthStore((state) => state.nim);
  const role = useAuthStore((state) => state.role);

  return useQuery({
    queryKey: ["imp", nim, role ],
    queryFn: () =>
      siaMobileServices.getImp({ Nim: nim, Role: role }),
    enabled: !!nim && !!role,
    staleTime: 1000 * 60 * 5,
  });
};