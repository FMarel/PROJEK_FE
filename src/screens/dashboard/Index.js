import React from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";

import { useAuthStore } from "@/store/useAuthStore";
import { useDashboard } from "@/hooks/useDashboard";
import { useMenuPermission } from "@/hooks/useMenuPermission";
import { useBukuPedoman } from "@/hooks/useBukuPedoman";

import { AppText } from "@/components/ui/AppText";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { COLORS, SPACING } from "@/constants/theme";

import {
  User,
  BookOpen,
  DollarSign,
  GraduationCap,
  ClipboardList,
  Clock,
  FileCheck,
  History,
  BookMarked,
  Megaphone,
  CalendarDays,
  TrendingUp,
  Library,
} from "lucide-react-native";

// ============================================================
// KONFIGURASI MENU
// ============================================================
const MENU_ITEMS = [
  { icon: User,          label: "Profil",    color: "#4CAF50", permission: "profile.view",                         screen: "ProfilMahasiswa" },
  { icon: TrendingUp, label: "Performa",  color: "#2196F3", permission: "performa.view",                        screen: "Performa" },
  { icon: DollarSign,    label: "Keuangan",  color: "#9C27B0", permission: "keuangan.view",                       screen: "Keuangan" },
  { icon: Megaphone,     label: "Informasi", color: "#FF9800", permission: "informasi.view",                      screen: "Informasi" },
  { icon: ClipboardList,      label: "Jadwal",    color: "#E91E63", permission: "jadwal_perkuliahan.view",             screen: "Jadwal" },
  { icon: History,       label: "Riwayat",   color: "#795548", permission: "riwayat_status_kuliah.view",          screen: "Riwayat" },
  { icon: BookMarked,    label: "RPS",       color: "#3F51B5", permission: "rps.view",                            screen: "RPS" },
  { icon: FileCheck,     label: "IMP",       color: "#009688", permission: "izin_meninggalkan_perkuliahan.view", screen: "IMP" },
  { icon: CalendarDays,          label: "Kalender",  color: "#FF5722", permission: "kalender_akademik.view",              screen: "KalenderAkademik" },
  { icon: Library,       label: "Pedoman",   color: "#1565C0", permission: "buku_pedoman.view",                   screen: "BukuPedoman" },
];

// ============================================================
// KOMPONEN UTAMA
// ============================================================
const DashboardScreen = () => {
  const { nama, nim, logout } = useAuthStore();
  const navigation = useNavigation();
  const { data, isLoading } = useDashboard();
  const { hasAccess } = useMenuPermission();
  const { data: bukuData } = useBukuPedoman();

  const dashboardData = data;

  // ── Handler Buku Pedoman ──────────────────────────────────
  const handleBukuPedoman = async () => {
    const fileUrl = bukuData?.[0]?.fileUrl;
    if (!fileUrl) {
      Alert.alert("Info", "Buku pedoman belum tersedia.");
      return;
    }
    try {
      await WebBrowser.openBrowserAsync(fileUrl);
    } catch (error) {
      Alert.alert("Error", "Gagal membuka buku pedoman.");
    }
  };

  // ── Filter menu berdasarkan permission ────────────────────
  const filteredMenu = MENU_ITEMS.filter((item) => hasAccess(item.permission));

  // ── Loading State ─────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <SkeletonLoader width="70%" height={24} style={{ marginBottom: 8 }} />
          <SkeletonLoader width="50%" height={16} />
        </View>
        <View style={styles.summaryRow}>
          <SkeletonLoader width="30%" height={80} />
          <SkeletonLoader width="30%" height={80} />
          <SkeletonLoader width="30%" height={80} />
        </View>
        <View style={styles.menuGrid}>
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonLoader key={i} width="30%" height={80} style={{ borderRadius: 16 }} />
          ))}
        </View>
      </View>
    );
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerOverlay}>
          <View style={styles.headerContent}>
            <View style={styles.welcomeBadge}>
              <AppText style={styles.welcomeBadgeText}>SIA Orang Tua</AppText>
            </View>
            <AppText style={styles.greeting}>Selamat Datang Orang Tua/Wali,</AppText>
            <AppText style={styles.parentName}>{nama || "Orang Tua"}</AppText>
          </View>
          <View style={styles.avatarContainer}>
            <GraduationCap size={36} color={COLORS.white} />
          </View>
        </View>
      </View>

      {/* RINGKASAN AKADEMIK */}
      <View style={styles.summarySection}>
        <AppText style={styles.sectionTitle}>Ringkasan Akademik</AppText>
        <View style={styles.summaryRow}>
          {/* IPK */}
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: "#E3F2FD" }]}>
              <BookOpen size={22} color="#1565c0" />
            </View>
            <AppText style={styles.summaryLabel}>IPK</AppText>
            <AppText style={styles.summaryValue}>
              {dashboardData?.performaIP?.ipk?.toFixed(2) || "0.00"}
            </AppText>
          </View>

          {/* Kehadiran */}
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: "#FFF3E0" }]}>
              <Clock size={22} color="#FF9800" />
            </View>
            <AppText style={styles.summaryLabel}>Kehadiran</AppText>
            <AppText style={styles.summaryValue}>
              {dashboardData?.performaIP?.persentaseKehadiran || "0"}%
            </AppText>
          </View>

          {/* Tagihan */}
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: "#F3E5F5" }]}>
              <DollarSign size={22} color="#9C27B0" />
            </View>
            <AppText style={styles.summaryLabel}>Tagihan</AppText>
            <AppText style={[styles.summaryValue, { fontSize: 15 }]}>
              {dashboardData?.tagihan?.length > 0 ? "Ada" : "Lunas"}
            </AppText>
          </View>
        </View>
      </View>

      {/* MENU GRID */}
      <View style={styles.menuSection}>
        <AppText style={styles.sectionTitle}>Menu Informasi</AppText>
        <View style={styles.menuGrid}>
          {filteredMenu.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuCard}
              onPress={
                item.screen === "BukuPedoman"
                  ? handleBukuPedoman
                  : () => navigation.navigate(item.screen, { nim })
              }
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + "18" }]}>
                <item.icon size={26} color={item.color} />
              </View>
              <AppText style={styles.menuLabel} numberOfLines={2}>
                {item.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <AppText style={styles.logoutText}>Keluar dari Aplikasi</AppText>
      </TouchableOpacity>
    </View>
  );
};

// ============================================================
// STYLES
// ============================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  // ── Header ────────────────────────────────────────────────
  header: {
    backgroundColor: "#1565c0",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },
  headerOverlay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: SPACING.l,
    paddingTop: 50,
    paddingBottom: 24,
  },
  headerContent: {
    flex: 1,
  },
  welcomeBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  welcomeBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  greeting: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },
  parentName: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 2,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  // ── Ringkasan ─────────────────────────────────────────────
  summarySection: {
    paddingHorizontal: SPACING.l,
    marginTop: SPACING.m,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 10,
    color: "#999",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
  },

  // ── Menu Grid ─────────────────────────────────────────────
  menuSection: {
    flex: 1,
    paddingHorizontal: SPACING.l,
    marginTop: SPACING.m,
    justifyContent: "center",
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  menuCard: {
    width: "30%",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  menuLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    lineHeight: 14,
  },

  // ── Logout ────────────────────────────────────────────────
  logoutButton: {
    marginHorizontal: SPACING.l,
    marginVertical: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FF5252",
    alignItems: "center",
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF5252",
  },
});

export default DashboardScreen;