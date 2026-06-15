import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "@/store/useAuthStore";
import { useKeuangan } from "@/hooks/useKeuangan";
import { KeuanganCard } from "@/components/module/keuangan/KeuanganCard";
import { VirtualAccountCard } from "@/components/module/keuangan/VirtualAccountCard";

const formatRupiah = (value) => {
  const number = Number(value || 0);
  return `Rp ${number.toLocaleString("id-ID")}`;
};

const KeuanganScreen = () => {
  const navigation = useNavigation();
  const nim = useAuthStore((state) => state.nim);

  const {
    tagihan,
    virtualAccount,
    totalTagihan,
    totalPembayaran,
    loading,
    fetchKeuangan,
  } = useKeuangan();

  const [filter, setFilter] = useState("semua");

  const sisaTagihan = totalTagihan - totalPembayaran;

  const filteredTagihan = tagihan.filter((item) => {
    const sisa =
      Number(item.tagihan || 0) - Number(item.pembayaran || 0);

    if (filter === "belum") return sisa > 0;
    if (filter === "lunas") return sisa <= 0;

    return true;
  });

  const loadData = () => {
    if (!nim) return;

    fetchKeuangan({
      nim,
    });
  };

  useEffect(() => {
    loadData();
  }, [nim]);

return (
  <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons
          name="chevron-back"
          size={24}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      <AppText style={styles.headerTitle}>
        Keuangan
      </AppText>
    </View>

    <FlatList
      data={filteredTagihan}
        keyExtractor={(item, index) =>
          item?.rowNumber
            ? item.rowNumber.toString()
            : index.toString()
        }
        renderItem={({ item }) => (
          <KeuanganCard item={item} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <View style={styles.heroCircle} />

              <AppText style={styles.heroSub}>
                Sisa Tagihan
              </AppText>

              <AppText style={styles.heroValue}>
                {formatRupiah(sisaTagihan)}
              </AppText>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <AppText style={styles.summaryLabel}>
                  Total Tagihan
                </AppText>

                <AppText style={styles.summaryValue}>
                  {formatRupiah(totalTagihan)}
                </AppText>
              </View>

              <View style={styles.summaryCard}>
                <AppText style={styles.summaryLabel}>
                  Dibayar
                </AppText>

                <AppText
                  style={[
                    styles.summaryValue,
                    styles.paidValue,
                  ]}
                >
                  {formatRupiah(totalPembayaran)}
                </AppText>
              </View>
            </View>

            <VirtualAccountCard data={virtualAccount} />

            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  filter === "semua" &&
                    styles.filterButtonActive,
                ]}
                onPress={() => setFilter("semua")}
                activeOpacity={0.8}
              >
                <AppText
                  style={[
                    styles.filterText,
                    filter === "semua" &&
                      styles.filterTextActive,
                  ]}
                >
                  Semua
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  filter === "belum" &&
                    styles.filterButtonActive,
                ]}
                onPress={() => setFilter("belum")}
                activeOpacity={0.8}
              >
                <AppText
                  style={[
                    styles.filterText,
                    filter === "belum" &&
                      styles.filterTextActive,
                  ]}
                >
                  Belum Lunas
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  filter === "lunas" &&
                    styles.filterButtonActive,
                ]}
                onPress={() => setFilter("lunas")}
                activeOpacity={0.8}
              >
                <AppText
                  style={[
                    styles.filterText,
                    filter === "lunas" &&
                      styles.filterTextActive,
                  ]}
                >
                  Lunas
                </AppText>
              </TouchableOpacity>
            </View>

            <AppText style={styles.sectionLabel}>
              DAFTAR TAGIHAN
            </AppText>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="wallet-outline"
              size={42}
              color="#CBD5E1"
            />

            <AppText style={styles.emptyText}>
              Tidak ada data tagihan
            </AppText>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  content: {
    padding: 16,
    paddingBottom: 32,
    paddingTop: 20,
  },

  hero: {
    backgroundColor: "#0D47A1",
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingVertical: 28,
    marginBottom: 14,
    overflow: "hidden",
  },

  heroCircle: {
    position: "absolute",
    right: -34,
    top: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  heroTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  heroSub: {
    fontSize: 15,
    color: "rgba(255,255,255,0.95)",
    marginTop: 10,
    fontWeight: "700",
  },

  heroValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 4,
  },

  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

    summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,

    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#000000",
    marginBottom: 6,
    fontWeight: "800",
  },

  summaryValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FF0000",
  },

  paidValue: {
    color: "#00A884",
  },

  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
    marginBottom: 14,
  },

  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  filterButtonActive: {
    backgroundColor: "#0D47A1",
    borderColor: "#0D47A1",
  },

  filterText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },

  filterTextActive: {
    color: "#FFFFFF",
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 70,
  },

  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },
    header: {
    backgroundColor: "#0D47A1",
    paddingTop: 52,
    paddingBottom: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
});

export default KeuanganScreen;