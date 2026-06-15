import { useQuery } from "@tanstack/react-query";
import { siaMobileServices } from "@/services/siaMobileServices";

const getAcademicYear = () => {
  const now = new Date();

  const year = now.getFullYear();

  const month = now.getMonth() + 1;

  if (month >= 7) {
    return `${year}/${year + 1}`;
  }

  return `${year - 1}/${year}`;
};

export const useKalenderAkademik = () => {
  return useQuery({
    queryKey: ["kalender-akademik"],

    queryFn: () =>
      siaMobileServices.getKalenderAkademik({
        Tahun: getAcademicYear(),
        Status: "",
      }),

    staleTime: 1000 * 60 * 5,
  });
};