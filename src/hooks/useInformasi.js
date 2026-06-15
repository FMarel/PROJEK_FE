import { siaMobileServices } from "@/services/siaMobileServices";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";

export const useInformasi = (params) => {
  const nim = useAuthStore((state) => state.nim);

  return useInfiniteQuery({
    queryKey: ["informasi", { ...params, nim }],
    queryFn: ({ pageParam = 1 }) =>
      siaMobileServices.getAllInformasi({
        ...params,
        Nim: nim,
        PageNumber: pageParam,
        PageSize: 10,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const totalData = lastPage?.totalData || 0;
      const loadedData = allPages.reduce((sum, page) => sum + (page?.data?.length || 0), 0);
      return loadedData < totalData ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!nim,
    staleTime: 5000,
  });
};

export const useDetailInformasi = (id) => {
  return useQuery({
    queryKey: ["informasi", "detail", id],
    queryFn: () => siaMobileServices.getDetailInformasi(id),
    enabled: !!id,
  });
};

export const useSetBacaInformasi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: siaMobileServices.setBacaInformasi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["informasi"],
      });
    },
  });
};