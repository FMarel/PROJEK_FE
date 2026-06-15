import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const parseWaktu = (waktu = "") => {
  const [tanggal = "", jamMulai = "", jamSelesai = ""] = waktu.split("#");
  return { tanggal, jamMulai, jamSelesai };
};

const formatTanggalLengkap = (dateStr = "") => {
  if (!dateStr) return "-";
  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatCreatedDate = (isoStr = "") => {
  if (!isoStr) return "-";
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return isoStr;
  const bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  const d  = date.getDate();
  const m  = bulan[date.getMonth()];
  const y  = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${d} ${m} ${y}, ${hh}:${mm}`;
};

// ─── Hero config ───────────────────────────────────────────────────────────────

const HERO_CONFIG = {
  "Disetujui": {
    bg: "#0EA96A", icon: "✅", label: "Disetujui",
    infoBg: null, infoBorder: null, infoText: null, infoMsg: null,
  },
  "Menunggu Approval Dosen": {
    bg: "#D97706", icon: "⏳", label: "Menunggu Approval Dosen",
    infoBg: "#FEF3C7", infoBorder: "#FDE68A",
    infoText: "#92400E",
    infoMsg: "IMP ini masih menunggu persetujuan dari dosen pengampu.",
  },
  "Ditolak": {
    bg: "#DC2626", icon: "❌", label: "Ditolak",
    infoBg: "#FEE2E2", infoBorder: "#FECACA",
    infoText: "#991B1B",
    infoMsg: "IMP ini telah ditolak oleh dosen pengampu.",
  },
};

const getHero = (status) =>
  HERO_CONFIG[status] ?? {
    bg: "#1565C0", icon: "📋", label: status,
    infoBg: null, infoMsg: null,
  };

// ─── Sub-components ────────────────────────────────────────────────────────────

const InfoRow = ({ label, value, mono = false, last = false }) => (
  <View style={[styles.infoRow, last && styles.infoRowLast]}>
    <Text style={styles.infoKey}>{label}</Text>
    <Text style={[styles.infoVal, mono && styles.infoValMono]} numberOfLines={3}>
      {value || "-"}
    </Text>
  </View>
);

const SectionCard = ({ title, children }) => (
  <View style={styles.sectionCard}>
    {title && <Text style={styles.sectionCardTitle}>{title}</Text>}
    {children}
  </View>
);

// ─── Main Screen ───────────────────────────────────────────────────────────────

const IMPDetailScreen = ({ navigation }) => {
  const route   = useRoute();
  const impData = route.params?.impData;

  if (!impData) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail IMP</Text>
        </View>
        <View style={styles.errorWrap}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.emptyTitle}>Data tidak ditemukan</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.retryText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const hero = getHero(impData.status);
  const { tanggal, jamMulai, jamSelesai } = parseWaktu(impData.waktu);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />

      {/* Header — identik dengan KalenderAkademik */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail IMP</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero Status */}
        <View style={[styles.heroCard, { backgroundColor: hero.bg }]}>
          <View style={styles.heroCircle} />
          <Text style={styles.heroIcon}>{hero.icon}</Text>
          <Text style={styles.heroStatus}>{hero.label}</Text>
          <Text style={styles.heroId}>ID IMP: #{impData.impId}</Text>
        </View>

        {/* Informasi IMP */}
        <SectionCard title="INFORMASI IMP">
          <InfoRow label="ID IMP"       value={`#${impData.impId}`} mono />
          <InfoRow label="Mata Kuliah"  value={impData.mataKuliah} />
          <InfoRow label="Semester"     value={impData.semester} />
          <InfoRow label="Tahun Ajaran" value={impData.tahunAjaran} />
          <InfoRow label="Kelas"        value={impData.kelas} mono />
          <InfoRow label="Section"      value={impData.section} />
          <InfoRow label="Konsentrasi"  value={impData.konsentrasi} last />
        </SectionCard>

        {/* Waktu Pelaksanaan */}
        <SectionCard title="WAKTU PELAKSANAAN">
          <View style={styles.timeHeader}>
            <Text style={styles.timeDate}>📅 {formatTanggalLengkap(tanggal)}</Text>
          </View>
          <View style={styles.timeBlock}>
            <View style={styles.timePill}>
              <Text style={styles.timeLbl}>Mulai</Text>
              <Text style={styles.timeVal}>{jamMulai || "-"}</Text>
            </View>
            <Text style={styles.timeArrow}>→</Text>
            <View style={styles.timePill}>
              <Text style={styles.timeLbl}>Selesai</Text>
              <Text style={styles.timeVal}>{jamSelesai || "-"}</Text>
            </View>
          </View>
        </SectionCard>

        {/* Informasi Tambahan */}
        <SectionCard title="INFORMASI TAMBAHAN">
          <InfoRow label="Dibuat pada" value={formatCreatedDate(impData.createdDate)} />
          <InfoRow label="NIM"         value={impData.nim} mono />
          <InfoRow label="Mahasiswa"   value={impData.namaMahasiswa} last />
        </SectionCard>

        {/* Info pill kontekstual */}
        {hero.infoMsg && (
          <View style={[styles.infoPill, { backgroundColor: hero.infoBg, borderColor: hero.infoBorder }]}>
            <Text style={styles.infoPillIcon}>{hero.icon}</Text>
            <Text style={[styles.infoPillText, { color: hero.infoText }]}>{hero.infoMsg}</Text>
          </View>
        )}

      </ScrollView>
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

  // Scroll
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },

  // Hero card
  heroCard: {
    borderRadius: 18,
    padding: 18,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  heroCircle: {
    position: "absolute",
    top: -40,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  heroIcon:   { fontSize: 30, marginBottom: 8 },
  heroStatus: { color: "#fff", fontSize: 18, fontWeight: "700" },
  heroId:     { color: "rgba(255,255,255,0.65)", fontSize: 11, marginTop: 3 },

  // Section card — sama dengan agendaCard KalenderAkademik
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionCardTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#607D8B",
    letterSpacing: 0.6,
    paddingHorizontal: 16,
    paddingTop: 13,
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F7FB",
  },

  // Info row
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F7FB",
    gap: 8,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoKey: {
    fontSize: 12,
    color: "#607D8B",
    fontWeight: "500",
    flexShrink: 0,
    minWidth: 95,
    marginTop: 1,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "right",
    flex: 1,
    lineHeight: 18,
  },
  infoValMono: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#1565C0",
  },

  // Waktu
  timeHeader: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  timeDate:   { fontSize: 12, fontWeight: "600", color: "#607D8B" },
  timeBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: "#F0F7FF",
    borderRadius: 12,
    padding: 12,
  },
  timePill: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2ECF8",
    padding: 10,
    alignItems: "center",
  },
  timeLbl:  { fontSize: 10, color: "#607D8B", fontWeight: "600", marginBottom: 2 },
  timeVal:  { fontSize: 18, fontWeight: "700", color: "#1E293B" },
  timeArrow:{ fontSize: 18, color: "#94A3B8", flexShrink: 0 },

  // Info pill
  infoPill: {
    borderRadius: 12,
    padding: 13,
    borderWidth: 1,
    flexDirection: "row",
    gap: 9,
    alignItems: "flex-start",
  },
  infoPillIcon: { fontSize: 15, flexShrink: 0 },
  infoPillText: { fontSize: 12, lineHeight: 18, flex: 1 },

  // Error / Empty
  errorWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyIcon:  { fontSize: 44, marginBottom: 4 },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: "#1E293B" },
  retryBtn: {
    marginTop: 8,
    backgroundColor: "#0D47A1",
    paddingHorizontal: 28,
    paddingVertical: 11,
    borderRadius: 12,
  },
  retryText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});

export default IMPDetailScreen;