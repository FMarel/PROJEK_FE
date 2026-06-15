import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  RefreshControl,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useImp } from "@/hooks/useImp";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parseWaktu = (waktu = "") => {
  const [tanggal = "", jamMulai = "", jamSelesai = ""] = waktu.split("#");
  return { tanggal, jamMulai, jamSelesai };
};

const formatTanggal = (dateStr = "") => {
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("-");
  const bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  return `${parseInt(day, 10)} ${bulan[parseInt(month, 10) - 1] ?? ""} ${year}`;
};

// ─── Badge config ──────────────────────────────────────────────────────────────

const BADGE_CONFIG = {
  "Disetujui": {
    bg: "#E6F9F1", text: "#0EA96A", dot: "#1DB97A", label: "Disetujui",
  },
  "Menunggu Approval Dosen": {
    bg: "#FEF3C7", text: "#D97706", dot: "#F59E0B", label: "Menunggu",
  },
  "Ditolak": {
    bg: "#FEE2E2", text: "#DC2626", dot: "#EF4444", label: "Ditolak",
  },
};

const getBadge = (status) =>
  BADGE_CONFIG[status] ?? { bg: "#F1F5FB", text: "#64748B", dot: "#94A3B8", label: status };

// ─── Filter options ────────────────────────────────────────────────────────────

const FILTERS = [
  { key: "Semua",                   label: "Semua"     },
  { key: "Disetujui",               label: "Disetujui" },
  { key: "Menunggu Approval Dosen", label: "Menunggu"  },
  { key: "Ditolak",                 label: "Ditolak"   },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = getBadge(status);
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <View style={[styles.badgeDot, { backgroundColor: cfg.dot }]} />
      <Text style={[styles.badgeText, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
};

const SummaryCard = ({ data = [] }) => {
  const disetujui = data.filter((d) => d.status === "Disetujui").length;
  const menunggu  = data.filter((d) => d.status === "Menunggu Approval Dosen").length;
  const ditolak   = data.filter((d) => d.status === "Ditolak").length;

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryCircle1} />
      <View style={styles.summaryCircle2} />
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>Ringkasan IMP</Text>
        <View style={styles.summaryTotalPill}>
          <Text style={styles.summaryTotalText}>Total {data.length}</Text>
        </View>
      </View>
      <View style={styles.summaryGrid}>
        <View style={styles.summaryStat}>
          <Text style={[styles.summaryVal, { color: "#6EE7B7" }]}>{disetujui}</Text>
          <Text style={[styles.summaryLbl, { color: "rgba(110,231,183,0.75)" }]}>Disetujui</Text>
        </View>
        <View style={styles.summaryStat}>
          <Text style={[styles.summaryVal, { color: "#FDE68A" }]}>{menunggu}</Text>
          <Text style={[styles.summaryLbl, { color: "rgba(253,230,138,0.75)" }]}>Menunggu</Text>
        </View>
        <View style={styles.summaryStat}>
          <Text style={[styles.summaryVal, { color: "#FCA5A5" }]}>{ditolak}</Text>
          <Text style={[styles.summaryLbl, { color: "rgba(252,165,165,0.75)" }]}>Ditolak</Text>
        </View>
      </View>
    </View>
  );
};

const ImpCard = ({ item, onPress }) => {
  const { tanggal, jamMulai, jamSelesai } = parseWaktu(item.waktu);
  return (
    <TouchableOpacity style={styles.impCard} onPress={() => onPress(item)} activeOpacity={0.7}>
      <View style={styles.impCardTop}>
        <Text style={styles.impMatkul} numberOfLines={2}>{item.mataKuliah}</Text>
        <StatusBadge status={item.status} />
      </View>
      <View style={styles.impDivider} />
      <View style={styles.impMeta}>
        <View style={styles.impMetaItem}>
          <Text style={styles.impMetaIcon}>📅</Text>
          <Text style={styles.impMetaText}>{formatTanggal(tanggal)}</Text>
        </View>
        <View style={styles.impMetaSep} />
        <View style={styles.impMetaItem}>
          <Text style={styles.impMetaIcon}>🕐</Text>
          <Text style={styles.impMetaText}>{jamMulai} – {jamSelesai}</Text>
        </View>
        <View style={styles.impMetaSep} />
        <View style={styles.impMetaItem}>
          <Text style={styles.impMetaIcon}>📚</Text>
          <Text style={styles.impMetaText}>Sem {item.semester}</Text>
        </View>
      </View>
      <Text style={styles.impChevron}>›</Text>
    </TouchableOpacity>
  );
};

const EmptyState = ({ query }) => (
  <View style={styles.emptyWrap}>
    <Text style={styles.emptyIcon}>📋</Text>
    <Text style={styles.emptyTitle}>
      {query ? "Tidak ditemukan" : "Belum ada data IMP"}
    </Text>
    <Text style={styles.emptySub}>
      {query
        ? `Tidak ada IMP yang cocok dengan "${query}"`
        : "Data IMP akan muncul di sini"}
    </Text>
  </View>
);

// ─── Main Screen ───────────────────────────────────────────────────────────────

const IMPScreen = ({ navigation }) => {
  const { data: response, isLoading, isError, refetch, isFetching } = useImp();

  const [activeFilter, setActiveFilter] = useState("Semua");
  const [searchQuery, setSearchQuery]   = useState("");

  const allData = response?.data ?? [];

  const filteredData = useMemo(() => {
    let result = allData;
    if (activeFilter !== "Semua") {
      result = result.filter((d) => d.status === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((d) => d.mataKuliah.toLowerCase().includes(q));
    }
    return result;
  }, [allData, activeFilter, searchQuery]);

  const handleCardPress = (item) => {
    navigation.navigate("IMPDetail", { impData: item });
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>IMP</Text>
        </View>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#1565C0" />
          <Text style={styles.loadingText}>Memuat data IMP...</Text>
        </View>
      </View>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>IMP</Text>
        </View>
        <View style={styles.loadingWrap}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.emptyTitle}>Gagal Memuat Data</Text>
          <Text style={styles.emptySub}>Periksa koneksi internet kamu</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Main ───────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />

      {/* Header — identik dengan KalenderAkademik */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>IMP</Text>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.impId}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            colors={["#1565C0"]}
            tintColor="#1565C0"
          />
        }
        ListHeaderComponent={
          <>
            <SummaryCard data={allData} />
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Cari mata kuliah..."
                placeholderTextColor="#CBD5E1"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Text style={styles.searchClear}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
              contentContainerStyle={styles.filterContent}
            >
              {FILTERS.map((f) => (
                <TouchableOpacity
                  key={f.key}
                  style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
                  onPress={() => setActiveFilter(f.key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterChipText, activeFilter === f.key && styles.filterChipTextActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.sectionTitle}>
              RIWAYAT IMP{filteredData.length !== allData.length ? ` (${filteredData.length})` : ""}
            </Text>
          </>
        }
        ListEmptyComponent={<EmptyState query={searchQuery} />}
        renderItem={({ item }) => <ImpCard item={item} onPress={handleCardPress} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  // ── Header — identik dengan KalenderAkademik ──
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
    fontWeight: "700",
  },

  // List
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  separator: {
    height: 10,
  },

  // Summary card
  summaryCard: {
    backgroundColor: "#0D47A1",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#0D47A1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  summaryCircle1: {
    position: "absolute",
    top: -40,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  summaryCircle2: {
    position: "absolute",
    bottom: -20,
    left: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryTitle: { color: "#fff", fontSize: 13, fontWeight: "700" },
  summaryTotalPill: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  summaryTotalText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  summaryGrid: { flexDirection: "row", gap: 8 },
  summaryStat: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  summaryVal: { fontSize: 22, fontWeight: "700", lineHeight: 26 },
  summaryLbl: { fontSize: 9, marginTop: 3, fontWeight: "500", textAlign: "center" },

  // Search
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2ECF8",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 13, color: "#0F2744", padding: 0 },
  searchClear: { fontSize: 12, color: "#94A3B8", paddingHorizontal: 4 },

  // Filter
  filterScroll: { marginBottom: 12 },
  filterContent: { gap: 7, paddingRight: 4 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E2ECF8",
    backgroundColor: "#fff",
  },
  filterChipActive: { backgroundColor: "#0D47A1", borderColor: "#0D47A1" },
  filterChipText: { fontSize: 11, fontWeight: "600", color: "#64748B" },
  filterChipTextActive: { color: "#fff" },

  // Section title — sama dengan KalenderAkademik
  sectionTitle: {
    color: "#607D8B",
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 10,
  },

  // IMP Card — sama dengan agendaCard KalenderAkademik
  impCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    position: "relative",
  },
  impCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 9,
    gap: 8,
  },
  impMatkul: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
    lineHeight: 18,
  },
  impDivider: { height: 1, backgroundColor: "#F4F7FB", marginBottom: 9 },
  impMeta: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6 },
  impMetaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  impMetaIcon: { fontSize: 11 },
  impMetaText: { fontSize: 11, color: "#607D8B", fontWeight: "500" },
  impMetaSep: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: "#CBD5E1" },
  impChevron: {
    position: "absolute",
    right: 14,
    top: "50%",
    fontSize: 20,
    color: "#CBD5E1",
    fontWeight: "300",
    marginTop: -12,
  },

  // Badge
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
    flexShrink: 0,
  },
  badgeDot: { width: 5, height: 5, borderRadius: 2.5 },
  badgeText: { fontSize: 9, fontWeight: "700" },

  // Loading / Error / Empty
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  loadingText: { color: "#64748B", fontSize: 14, marginTop: 4 },
  emptyWrap: { alignItems: "center", paddingTop: 40, paddingHorizontal: 32, gap: 8 },
  emptyIcon: { fontSize: 44, marginBottom: 4 },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: "#1E293B" },
  emptySub: { fontSize: 12, color: "#94A3B8", textAlign: "center", lineHeight: 18 },
  retryBtn: {
    marginTop: 8,
    backgroundColor: "#0D47A1",
    paddingHorizontal: 28,
    paddingVertical: 11,
    borderRadius: 12,
  },
  retryText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});

export default IMPScreen;