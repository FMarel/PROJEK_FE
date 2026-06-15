import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useRiwayatKuliah } from "@/hooks/useRiwayatKuliah";
import { useRiwayatStudi } from "@/hooks/useRiwayatStudi";

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Group array by field
 * groupBy([{semester:"1",...},{semester:"1",...},{semester:"2",...}], "semester")
 * → { "1": [...], "2": [...] }
 */
const groupBy = (arr, key) =>
  arr.reduce((acc, item) => {
    const k = item[key];
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});

// ─── Sub-components ────────────────────────────────────────────────────────────

const SummaryCard = ({ totalSemester, totalSks }) => (
  <View style={styles.summaryCard}>
    <View style={styles.summaryCircle1} />
    <View style={styles.summaryCircle2} />
    <View style={styles.summaryHeader}>
      <Text style={styles.summaryLabel}>Ringkasan Studi</Text>
    </View>
    <View style={styles.summaryGrid}>
      <View style={styles.summaryStat}>
        <Text style={styles.summaryVal}>{totalSemester}</Text>
        <Text style={styles.summaryLbl}>Total Semester</Text>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryStat}>
        <Text style={styles.summaryVal}>{totalSks}</Text>
        <Text style={styles.summaryLbl}>Total SKS Ditempuh</Text>
      </View>
    </View>
  </View>
);

const TimelineItem = ({ item, isLast }) => (
  <View style={styles.tlItem}>
    <View style={styles.tlLeft}>
      <View style={styles.tlDot} />
      {!isLast && <View style={styles.tlLine} />}
    </View>
    <View style={[styles.tlBody, !isLast && styles.tlBodyBorder]}>
      <View style={styles.tlRow}>
        <Text style={styles.tlSemester}>{item.semester}</Text>
        <Text style={styles.tlSks}>{item.sks} SKS</Text>
      </View>
      <View style={styles.tlMeta}>
        <View style={[
          styles.badge,
          item.status === "Aktif" ? styles.badgeGreen : styles.badgeBlue
        ]}>
          <View style={[
            styles.badgeDot,
            item.status === "Aktif" ? styles.badgeDotGreen : styles.badgeDotBlue
          ]} />
          <Text style={[
            styles.badgeText,
            item.status === "Aktif" ? styles.badgeTextGreen : styles.badgeTextBlue
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

const SemesterCard = ({ semesterKey, items, onPress }) => {
  const totalSks = items.reduce((sum, i) => sum + (i.sks ?? 0), 0);
  return (
    <TouchableOpacity
      style={styles.semCard}
      onPress={() => onPress(semesterKey, items)}
      activeOpacity={0.7}
    >
      <View style={styles.semIcon}>
        <Text style={styles.semIconText}>📘</Text>
      </View>
      <View style={styles.semBody}>
        <Text style={styles.semTitle}>Semester {semesterKey}</Text>
        <View style={styles.semMeta}>
          <Text style={styles.semMetaText}>🎓 {items.length} Mata Kuliah</Text>
          <View style={styles.semMetaDot} />
          <Text style={styles.semMetaText}>📚 {totalSks} SKS</Text>
        </View>
      </View>
      <ChevronRight size={18} color="#CBD5E1" />
    </TouchableOpacity>
  );
};

// ─── Main Screen ───────────────────────────────────────────────────────────────

const RiwayatAkademikScreen = ({ navigation }) => {
  const {
    data: kuliahRes,
    isLoading: loadingKuliah,
    isError: errorKuliah,
    refetch: refetchKuliah,
    isFetching: fetchingKuliah,
  } = useRiwayatKuliah();

  const {
    data: studiRes,
    isLoading: loadingStudi,
    isError: errorStudi,
    refetch: refetchStudi,
    isFetching: fetchingStudi,
  } = useRiwayatStudi();

  const isLoading  = loadingKuliah || loadingStudi;
  const isError    = errorKuliah   || errorStudi;
  const isFetching = fetchingKuliah || fetchingStudi;

  const kuliahData = kuliahRes?.data ?? [];
  const studiData  = studiRes?.data  ?? [];

  // Summary — dari riwayat kuliah
  const totalSemester = kuliahData.length;
  const totalSks      = kuliahData.reduce((sum, i) => sum + (i.sks ?? 0), 0);

  // Group riwayat studi by semester
  const studiGrouped = useMemo(
    () => groupBy(studiData, "semester"),
    [studiData]
  );
  const semesterKeys = useMemo(
    () => Object.keys(studiGrouped).sort((a, b) => parseInt(a) - parseInt(b)),
    [studiGrouped]
  );

  const handleRefresh = () => {
    refetchKuliah();
    refetchStudi();
  };

  const handleSemesterPress = (semesterKey, items) => {
    navigation.navigate("RiwayatDetail", {
      semester: semesterKey,
      data: items,
    });
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
          <Text style={styles.headerTitle}>Riwayat Akademik</Text>
        </View>
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" color="#1565C0" />
          <Text style={styles.loadingText}>Memuat riwayat akademik...</Text>
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
          <Text style={styles.headerTitle}>Riwayat Akademik</Text>
        </View>
        <View style={styles.centerWrap}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.emptyTitle}>Gagal Memuat Data</Text>
          <Text style={styles.emptySub}>Periksa koneksi internet kamu</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={handleRefresh}>
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Akademik</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={handleRefresh}
            colors={["#1565C0"]}
            tintColor="#1565C0"
          />
        }
      >
        {/* A. Summary Card */}
        <SummaryCard totalSemester={totalSemester} totalSks={totalSks} />

        {/* B. Riwayat Status Kuliah */}
        {kuliahData.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>RIWAYAT STATUS KULIAH</Text>
            <View style={styles.timelineCard}>
              {kuliahData.map((item, index) => (
                <TimelineItem
                  key={item.rowNumber}
                  item={item}
                  isLast={index === kuliahData.length - 1}
                />
              ))}
            </View>
          </>
        )}

        {/* C. Semester Studi */}
        {semesterKeys.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>SEMESTER STUDI</Text>
            {semesterKeys.map((key) => (
              <SemesterCard
                key={key}
                semesterKey={key}
                items={studiGrouped[key]}
                onPress={handleSemesterPress}
              />
            ))}
          </>
        )}

        {/* Empty state kalau tidak ada data */}
        {kuliahData.length === 0 && studiData.length === 0 && (
          <View style={styles.centerWrap}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Belum ada data</Text>
            <Text style={styles.emptySub}>Riwayat akademik akan muncul di sini</Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F7FB" },

  // Header — identik dengan KalenderAkademik
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
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center", alignItems: "center",
    marginRight: 12,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },

  // Scroll
  scrollContent: { padding: 16, paddingBottom: 40, gap: 10 },

  // Section title — sama dengan KalenderAkademik
  sectionTitle: {
    color: "#607D8B",
    fontWeight: "700",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 2,
  },

  // Summary card
  summaryCard: {
    backgroundColor: "#0D47A1",
    borderRadius: 18,
    padding: 16,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#0D47A1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  summaryCircle1: {
    position: "absolute", top: -40, right: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  summaryCircle2: {
    position: "absolute", bottom: -20, left: 20,
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  summaryHeader: { marginBottom: 12 },
  summaryLabel: { color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "600" },
  summaryGrid: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  summaryStat: { flex: 1, alignItems: "center" },
  summaryDivider: { width: 1, height: 36, backgroundColor: "rgba(255,255,255,0.2)" },
  summaryVal: { color: "#fff", fontSize: 26, fontWeight: "700", lineHeight: 30 },
  summaryLbl: { color: "rgba(255,255,255,0.6)", fontSize: 10, marginTop: 3, fontWeight: "500" },

  // Timeline card
  timelineCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  tlItem: { flexDirection: "row", gap: 12, minHeight: 56 },
  tlLeft: { alignItems: "center", width: 16, paddingTop: 16 },
  tlDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: "#1DB97A",
    borderWidth: 2, borderColor: "#fff",
    shadowColor: "#1DB97A",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
  tlLine: { flex: 1, width: 2, backgroundColor: "#E2ECF8", marginTop: 3 },
  tlBody: { flex: 1, paddingVertical: 14 },
  tlBodyBorder: { borderBottomWidth: 1, borderBottomColor: "#F4F7FB" },
  tlRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tlSemester: { fontSize: 13, fontWeight: "700", color: "#1E293B" },
  tlSks: { fontSize: 13, fontWeight: "700", color: "#1565C0" },
  tlMeta: { flexDirection: "row", marginTop: 5, gap: 6 },

  // Badge
  badge: {
    flexDirection: "row", alignItems: "center",
    gap: 4, borderRadius: 20,
    paddingHorizontal: 9, paddingVertical: 3,
  },
  badgeGreen:     { backgroundColor: "#E6F9F1" },
  badgeBlue:      { backgroundColor: "#E3F2FD" },
  badgeDot:       { width: 5, height: 5, borderRadius: 2.5 },
  badgeDotGreen:  { backgroundColor: "#1DB97A" },
  badgeDotBlue:   { backgroundColor: "#1565C0" },
  badgeText:      { fontSize: 10, fontWeight: "600" },
  badgeTextGreen: { color: "#0EA96A" },
  badgeTextBlue:  { color: "#1565C0" },

  // Semester card
  semCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  semIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: "#E3F2FD",
    alignItems: "center", justifyContent: "center",
  },
  semIconText: { fontSize: 18 },
  semBody: { flex: 1 },
  semTitle: { fontSize: 14, fontWeight: "700", color: "#1E293B" },
  semMeta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  semMetaText: { fontSize: 11, color: "#607D8B", fontWeight: "500" },
  semMetaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: "#CBD5E1" },

  // Loading / Error / Empty
  centerWrap: {
    flex: 1, alignItems: "center",
    justifyContent: "center", gap: 10,
    paddingHorizontal: 32, paddingTop: 60,
  },
  loadingText: { color: "#64748B", fontSize: 13, marginTop: 4 },
  emptyIcon: { fontSize: 44, marginBottom: 4 },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: "#1E293B" },
  emptySub: { fontSize: 12, color: "#94A3B8", textAlign: "center", lineHeight: 18 },
  retryBtn: {
    marginTop: 8, backgroundColor: "#0D47A1",
    paddingHorizontal: 28, paddingVertical: 11, borderRadius: 12,
  },
  retryText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});

export default RiwayatAkademikScreen;