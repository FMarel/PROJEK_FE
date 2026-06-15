import React, { useMemo, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { AppText } from "@/components/ui/AppText";

const getNilaiStyle = (nilai) => {
  switch (nilai) {
    case "A":  return { bg: "#E6F9F1", text: "#0EA96A" };
    case "AB": return { bg: "#E3F2FD", text: "#1565C0" };
    case "B":  return { bg: "#EFF6FF", text: "#3B82F6" };
    case "BC": return { bg: "#FEF3C7", text: "#D97706" };
    case "C":  return { bg: "#FEE2E2", text: "#DC2626" };
    case "E":  return { bg: "#FEE2E2", text: "#8f0a17" };
    default:   return { bg: "#F1F5FB", text: "#94A3B8" };
  }
};

const MkRow = ({ item, isLast }) => {
  const nilaiStyle = getNilaiStyle(item.nilai);
  return (
    <View style={[styles.mkRowCard, isLast && { marginBottom: 16 }]}>
      <View style={styles.mkRow}>
        <View style={styles.mkLeft}>
          <AppText style={styles.mkKode}>{item.kodeMataKuliah}</AppText>
          <AppText style={styles.mkNama}>{item.mataKuliah}</AppText>
          <View style={styles.mkBottom}>
            <AppText style={styles.mkSks}>{item.sks} SKS</AppText>
            <View style={styles.mkMetaDot} />
            <AppText style={styles.mkTipe}>{item.tipeMataKuliah}</AppText>
          </View>
        </View>
        <View style={[styles.nilaiChip, { backgroundColor: nilaiStyle.bg }]}>
          <AppText style={[styles.nilaiText, { color: nilaiStyle.text }]}>
            {item.nilai || "-"}
          </AppText>
        </View>
      </View>
    </View>
  );
};

const RiwayatDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const semester = route.params?.semester ?? "-";
  const data = route.params?.data ?? [];
  const totalSks = useMemo(
    () => data.reduce((sum, i) => sum + (i.sks ?? 0), 0),
    [data]
  );

  const [filter, setFilter] = useState("semua"); 

  const filteredData = useMemo(() => {
    if (filter === "teori") return data.filter(i => i.tipeMataKuliah?.toLowerCase() === "teori");
    if (filter === "praktek") return data.filter(i => i.tipeMataKuliah?.toLowerCase() === "praktek");
    return data;
  }, [filter, data]);

  const teori = data.filter((i) => i.tipeMataKuliah === "Teori");
  const praktek = data.filter((i) => i.tipeMataKuliah === "Praktek");

  const loadData = () => {
    // Tetap pakai data dari route.params
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />

      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => item.rowNumber?.toString() || index.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={loadData} />
        }
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <AppText style={styles.headerTitle}>
                Semester {semester}
              </AppText>
            </View>

            {/* Summary strip */}
            <View style={styles.summaryStrip}>
              <View style={styles.summaryItem}>
                <AppText style={styles.summaryVal}>{data.length}</AppText>
                <AppText style={styles.summaryLbl}>Mata Kuliah</AppText>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <AppText style={styles.summaryVal}>{totalSks}</AppText>
                <AppText style={styles.summaryLbl}>Total SKS</AppText>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <AppText style={styles.summaryVal}>{teori.length}</AppText>
                <AppText style={styles.summaryLbl}>Teori</AppText>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <AppText style={styles.summaryVal}>{praktek.length}</AppText>
                <AppText style={styles.summaryLbl}>Praktek</AppText>
              </View>
            </View>

            {/* Filter Buttons */}
            <View style={styles.filterRow}>
              {["semua", "teori", "praktek"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setFilter(type)}
                  style={[
                    styles.filterButton,
                    filter === type && styles.filterButtonActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <AppText
                    style={[
                      styles.filterText,
                      filter === type && styles.filterTextActive,
                    ]}
                  >
                    {type === "semua" ? "Semua" : type === "teori" ? "Teori" : "Praktek"}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>

            <AppText style={styles.sectionTitle}>DAFTAR MATA KULIAH</AppText>
          </>
        }
        renderItem={({ item, index }) => (
          <MkRow item={item} isLast={index === filteredData.length - 1} />
        )}
        ListFooterComponent={
          <View style={styles.legendCard}>
            <AppText style={styles.legendTitle}>KETERANGAN NILAI</AppText>
            <View style={styles.legendGrid}>
              {[
                { nilai: "A", label: "Sangat Baik" },
                { nilai: "AB", label: "Baik Sekali" },
                { nilai: "B", label: "Baik" },
                { nilai: "BC", label: "Cukup Baik" },
                { nilai: "C", label: "Cukup" },
                { nilai: "E", label: "Kurang" },
                { nilai: "-", label: "Belum ada" },
              ].map((l) => {
                const s = getNilaiStyle(l.nilai);
                return (
                  <View key={l.nilai} style={styles.legendItem}>
                    <View style={[styles.legendChip, { backgroundColor: s.bg }]}>
                      <AppText style={[styles.legendChipText, { color: s.text }]}>
                        {l.nilai}
                      </AppText>
                    </View>
                    <AppText style={styles.legendLabel}>{l.label}</AppText>
                  </View>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppText style={styles.emptyText}>
              Tidak ada data mata kuliah
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
    backgroundColor: "#F4F7FB"
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
    marginBottom: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700"
  },

  summaryStrip: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center"
  },
  summaryVal: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#1565C0" 
  },
  summaryLbl: { 
    fontSize: 10, 
    color: "#1e4559", 
    fontWeight: "600", 
    marginTop: 2 
  },
  summaryDivider: { 
    width: 1, 
    height: 32, 
    backgroundColor: "#E2ECF8" 
  },
    filterRow: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 16,
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
    backgroundColor: "#1A2F6E",
    borderColor: "#1A2F6E",
  },

  filterText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },

  filterTextActive: {
    color: "#FFFFFF",
  },
  sectionTitle: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  mkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  mkRowCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  mkRowLast: { 
    borderBottomWidth: 0 
  },
  mkLeft: { 
    flex: 1 
  },
  mkKode: { 
    fontSize: 10, 
    fontWeight: "700", 
    color: "#1565C0", 
    letterSpacing: 0.3 
  },
  mkNama: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#000000", 
    marginTop: 2, 
    lineHeight: 17 
  },
  mkBottom: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 5, 
    marginTop: 3 
  },
  mkSks: { 
    fontSize: 12, 
    color: "#000000", 
    fontWeight: "500" 
  },
  mkMetaDot: { 
    width: 3, 
    height: 3, 
    borderRadius: 1.5, 
    backgroundColor: "#CBD5E1" 
  },
  mkTipe: { fontSize: 12, 
    color: "#1e4559", 
    fontWeight: "500" 
  },

  nilaiChip: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  nilaiText: { 
    fontSize: 12, 
    fontWeight: "700" 
  },

  legendCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginHorizontal: 16,
    marginBottom: 40,
  },
  legendTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1e4559",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  legendGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendChip: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  legendChipText: { 
    fontSize: 10, 
    fontWeight: "700" 
  },
  legendLabel: { 
    fontSize: 11, 
    color: "#1e4559" 
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 72,
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 16,
    marginHorizontal: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "700",
    textAlign: "center",
  },
});

export default RiwayatDetailScreen;