import { useState } from "react";
import { siaMobileServices } from "@/services/siaMobileServices";

export const useKeuangan = () => {
  const [tagihan, setTagihan] = useState([]);
  const [virtualAccount, setVirtualAccount] = useState(null);
  const [totalTagihan, setTotalTagihan] = useState(0);
  const [totalPembayaran, setTotalPembayaran] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchKeuangan = async ({ nim }) => {
    try {
      setLoading(true);

      const tagihanResponse = await siaMobileServices.getTagihan({
        mhsId: nim,
        pageNumber: 1,
        pageSize: 100,
        searchKeyword: "",
        status: "",
        urut: "ASC",
      });

      const vaResponse = await siaMobileServices.getVirtualAccount({
        dulNoPendaftaran: nim,
        pageNumber: 1,
        pageSize: 10,
        searchKeyword: "",
        status: "",
        urut: "ASC",
      });

      const dataTagihan = tagihanResponse?.data || [];

      setTagihan(dataTagihan);
      setVirtualAccount(vaResponse || null);

      setTotalTagihan(
        dataTagihan.reduce((sum, item) => sum + Number(item.tagihan || 0), 0)
      );

      setTotalPembayaran(
        dataTagihan.reduce((sum, item) => sum + Number(item.pembayaran || 0), 0)
      );
    } catch (error) {
      console.log("ERROR KEUANGAN:", error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return {
    tagihan,
    virtualAccount,
    totalTagihan,
    totalPembayaran,
    loading,
    fetchKeuangan,
  };
};