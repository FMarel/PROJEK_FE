import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  FlatList,
  SafeAreaView,
} from "react-native";
import { ChevronLeft, ChevronRight, BookOpen, Layers } from "lucide-react-native";
import { AppText } from "@/components/ui/AppText";
import { useRps } from "@/hooks/useRps";

const SummaryCard = ({ totalMk, totalSks }) => (
  <View style={styles.summaryCard}>
    <View style={styles.summaryCircle1} />
    <View style={styles.summaryCircle2} />
    <View style={styles.summaryHeader}>
      <AppText style={styles.summaryLabel}>Ringkasan Studi Semester</AppText>
    </View>
    <View style={styles.summaryGrid}>
      <View style={styles.summaryStat}>
        <AppText style={styles.summaryVal}>{totalMk}</AppText>
        <AppText style={styles.summaryLbl}>Total Mata Kuliah</AppText>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryStat}>
        <AppText style={styles.summaryVal}>{totalSks}</AppText>
        <AppText style={styles.summaryLbl}>Total SKS Diambil</AppText>
      </View>
    </View>
  </View>
);

const Rps = ({ navigation }) => {
  const { data, isLoading, refetch, isFetching } = useRps("Final");

  const summary = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    // SINKRONISASI: item.sks (huruf kecil sesuai Swagger)
    const totalSks = list.reduce((sum, item) => sum + (item.sks || 0), 0);
    return { totalMk: list.length, totalSks };
  }, [data]);

  const renderHeader = () => (
    <View style={{ marginBottom: 10 }}>
      <SummaryCard totalMk={summary.totalMk} totalSks={summary.totalSks} />
      <AppText style={styles.sectionTitle}>DAFTAR RENCANA PERKULIAHAN</AppText>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listCard}
      onPress={() =>
        navigation.navigate("RPSDetail", {
          rpsid: item.rpsId,       // SINKRONISASI: item.rpsId
          matakuliah: item.mataKuliah, // SINKRONISASI: item.mataKuliah
          kelas: item.kelas,       // SINKRONISASI: item.kelas
        })
      }
    >
      <View style={styles.semIcon}>
        <BookOpen size={20} color="#1565C0" />
      </View>
      <View style={styles.semBody}>
        {/* SINKRONISASI: Properti sesuai Swagger */}
        <AppText style={styles.semTitle}>{item.mataKuliah}</AppText>
        <View style={styles.semMeta}>
          <AppText style={styles.semMetaText}>📚 {item.sks} SKS</AppText>
          <View style={styles.semMetaDot} />
          <AppText style={styles.semMetaText}>🏫 Kelas {item.kelas}</AppText>
          <View style={styles.semMetaDot} />
          <AppText style={styles.semMetaText}>🗓️ {item.tahunAjaran}</AppText>
        </View>
      </View>
      <ChevronRight size={18} color="#CBD5E1" />
    </TouchableOpacity>
  );

  if (isLoading && !isFetching) {
    return (
      <View style={styles.container}>
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" color="#1565C0" />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={22} color="#fff" />
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>Rencana Perkuliahan</AppText>
      </View>

      <FlatList
        data={Array.isArray(data) ? data : []}
        keyExtractor={(item, index) => item.rpsId?.toString() || index.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        ListEmptyComponent={
          <View style={styles.centerWrap}>
            <Layers size={40} color="#CBD5E1" />
            <AppText style={styles.emptyTitle}>Data tidak ditemukan.</AppText>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F7FB" },
  header: { backgroundColor: "#0D47A1", paddingTop: 52, paddingBottom: 18, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backButton: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", justifyContent: "center", alignItems: "center", marginRight: 12 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  scrollContent: { padding: 16, paddingBottom: 40 },
  sectionTitle: { color: "#607D8B", fontWeight: "700", fontSize: 12, marginTop: 20, marginBottom: 10, textTransform: "uppercase" },
  summaryCard: { backgroundColor: "#0D47A1", borderRadius: 18, padding: 16, overflow: "hidden", elevation: 4 },
  summaryCircle1: { position: "absolute", top: -40, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.05)" },
  summaryCircle2: { position: "absolute", bottom: -20, left: 20, width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.04)" },
  summaryHeader: { marginBottom: 12 },
  summaryLabel: { color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "600" },
  summaryGrid: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 12, alignItems: "center" },
  summaryStat: { flex: 1, alignItems: "center" },
  summaryDivider: { width: 1, height: 36, backgroundColor: "rgba(255,255,255,0.2)" },
  summaryVal: { color: "#fff", fontSize: 24, fontWeight: "700" },
  summaryLbl: { color: "rgba(255,255,255,0.6)", fontSize: 10, marginTop: 3 },
  listCard: { backgroundColor: "#fff", borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10, elevation: 2 },
  semIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#E3F2FD", alignItems: "center", justifyContent: "center" },
  semBody: { flex: 1 },
  semTitle: { fontSize: 14, fontWeight: "700", color: "#1E293B" },
  semMeta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  semMetaText: { fontSize: 11, color: "#607D8B", fontWeight: "500" },
  semMetaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: "#CBD5E1" },
  centerWrap: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 50 },
  emptyTitle: { fontSize: 15, fontWeight: "600", color: "#94A3B8", marginTop: 10 },
});

export default Rps;