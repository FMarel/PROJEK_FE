import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  usePerformaIP,
  usePerformaKehadiran,
  usePerformaPelanggaran,
} from "@/hooks/usePerforma";
import { AppText } from "@/components/ui/AppText";
import { AppCard } from "@/components/ui/AppCard";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { COLORS, SPACING } from "@/constants/theme";
import {
  ArrowLeft,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  BookOpen,
  Calendar,
} from "lucide-react-native";

const PerformaScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("ip");

  const {
    data: dataIP,
    isLoading: loadIP,
    refetch: refetchIP,
    isFetching: fetchIP,
  } = usePerformaIP();

  const {
    data: dataKehadiran,
    isLoading: loadKehadiran,
    refetch: refetchKehadiran,
    isFetching: fetchKehadiran,
  } = usePerformaKehadiran();

  const {
    data: dataPelanggaran,
    isLoading: loadPelanggaran,
    refetch: refetchPelanggaran,
    isFetching: fetchPelanggaran,
  } = usePerformaPelanggaran();

  const isLoading = loadIP || loadKehadiran || loadPelanggaran;
  const performaIP = dataIP?.data;
  const performaKehadiran = dataKehadiran?.data || [];
  const performaPelanggaran = dataPelanggaran?.data || [];

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={22} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.headerIcon}>
              <TrendingUp size={24} color={COLORS.white} />
            </View>
            <View>
              <AppText style={styles.headerTitle}>Performa</AppText>
              <AppText style={styles.headerSubtitle}>Memuat...</AppText>
            </View>
          </View>
        </View>
        <View style={{ padding: 20 }}>
          <SkeletonLoader width="100%" height={150} style={{ marginBottom: 16 }} />
          <SkeletonLoader width="100%" height={60} style={{ marginBottom: 16 }} />
          <SkeletonLoader width="100%" height={200} />
        </View>
      </View>
    );
  }

  const tabs = [
    { key: "ip", label: "IP & IPK", icon: TrendingUp },
    { key: "kehadiran", label: "Kehadiran", icon: CheckCircle },
    { key: "pelanggaran", label: "Pelanggaran", icon: AlertTriangle },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={22} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerIcon}>
            <TrendingUp size={24} color={COLORS.white} />
          </View>
          <View>
            <AppText style={styles.headerTitle}>Performa</AppText>
            <AppText style={styles.headerSubtitle}>
              Akademik Mahasiswa
            </AppText>
          </View>
        </View>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabWrapper}>
        <View style={styles.tabContainer}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Icon
                  size={20}
                  color={isActive ? COLORS.white : "#999"}
                />
                <AppText
                  style={[
                    styles.tabText,
                    isActive && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={fetchIP || fetchKehadiran || fetchPelanggaran}
            onRefresh={() => {
              refetchIP();
              refetchKehadiran();
              refetchPelanggaran();
            }}
            colors={["#1A237E"]}
          />
        }
      >
        {/* IP / IPK */}
        {activeTab === "ip" && (
          <>
            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <AppText style={styles.summaryLabel}>IPK</AppText>
                  <AppText style={styles.summaryValue}>
                    {performaIP?.ipk?.toFixed(2) || "0.00"}
                  </AppText>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <AppText style={styles.summaryLabel}>IP Semester</AppText>
                  <AppText style={styles.summaryValue}>
                    {performaIP?.ip?.toFixed(2) || "0.00"}
                  </AppText>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <AppText style={styles.summaryLabel}>Semester</AppText>
                  <AppText style={styles.summaryValue}>
                    {performaIP?.semester || "-"}
                  </AppText>
                </View>
              </View>
            </View>

            <AppText style={styles.sectionTitle}>Detail IP Semester</AppText>
            <AppCard style={styles.card}>
              <InfoRow
                icon={<BookOpen size={18} color="#1A237E" />}
                label="IP Semester"
                value={performaIP?.ip?.toFixed(2) || "-"}
              />
              <InfoRow
                icon={<TrendingUp size={18} color="#1A237E" />}
                label="IPK"
                value={performaIP?.ipk?.toFixed(2) || "-"}
              />
              <InfoRow
                icon={<Calendar size={18} color="#1A237E" />}
                label="Semester"
                value={performaIP?.semester || "-"}
                isLast
              />
            </AppCard>
          </>
        )}

        {/* Kehadiran */}
        {activeTab === "kehadiran" && (
          <>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <AppText style={styles.summaryLabel}>Total Semester</AppText>
                  <AppText style={styles.summaryValue}>
                    {performaKehadiran.length}
                  </AppText>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <AppText style={styles.summaryLabel}>Rata-rata</AppText>
                  <AppText style={styles.summaryValue}>
                    {performaKehadiran.length > 0
                      ? Math.round(
                          performaKehadiran.reduce(
                            (sum, i) => sum + (i.persentaseKehadiran || 0),
                            0,
                          ) / performaKehadiran.length,
                        )
                      : 0}
                    %
                  </AppText>
                </View>
              </View>
            </View>

            <AppText style={styles.sectionTitle}>Riwayat Kehadiran</AppText>
            {performaKehadiran.map((item, idx) => (
              <AppCard key={idx} style={styles.card}>
                <InfoRow
                  icon={<Calendar size={18} color="#1A237E" />}
                  label="Semester"
                  value={item.semester || "-"}
                />
                <InfoRow
                  icon={<CheckCircle size={18} color="#4CAF50" />}
                  label="Persentase Kehadiran"
                  value={`${item.persentaseKehadiran || 0}%`}
                  isLast
                />
              </AppCard>
            ))}
            {performaKehadiran.length === 0 && (
              <View style={styles.emptyContainer}>
                <AppText style={styles.emptyText}>Tidak ada data kehadiran.</AppText>
              </View>
            )}
          </>
        )}

        {/* Pelanggaran */}
        {activeTab === "pelanggaran" && (
          <>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <AppText style={styles.summaryLabel}>Teguran</AppText>
                  <AppText style={[styles.summaryValue, { color: "#FFC107" }]}>
                    {performaIP?.teguran || "0"}
                  </AppText>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <AppText style={styles.summaryLabel}>SP Aktif</AppText>
                  <AppText style={[styles.summaryValue, { color: "#FF5722" }]}>
                    {performaIP?.sp1 || performaIP?.sp2 || performaIP?.sp3 ? "Ya" : "Tidak"}
                  </AppText>
                </View>
              </View>
            </View>

            <AppText style={styles.sectionTitle}>Detail Pelanggaran</AppText>
            <AppCard style={styles.card}>
              <InfoRow
                icon={<AlertTriangle size={18} color="#FFC107" />}
                label="Teguran"
                value={performaIP?.teguran || "0"}
              />
              <InfoRow
                icon={<AlertTriangle size={18} color="#FF9800" />}
                label="SP 1"
                value={performaIP?.sp1 || "0"}
              />
              <InfoRow
                icon={<AlertTriangle size={18} color="#F44336" />}
                label="SP 2"
                value={performaIP?.sp2 || "0"}
              />
              <InfoRow
                icon={<AlertTriangle size={18} color="#D32F2F" />}
                label="SP 3"
                value={performaIP?.sp3 || "0"}
              />
              <InfoRow
                icon={<Clock size={18} color="#1A237E" />}
                label="Jam Minus"
                value={performaIP?.jamMinus || "0"}
              />
              <InfoRow
                icon={<AlertTriangle size={18} color="#1A237E" />}
                label="Total Pelanggaran"
                value={performaIP?.totalPelanggaran || "0"}
                isLast
              />
            </AppCard>
          </>
        )}
      </ScrollView>
    </View>
  );
};

// Komponen InfoRow
const InfoRow = ({ icon, label, value, isLast }) => (
  <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
    <View style={styles.infoIcon}>{icon}</View>
    <View style={styles.infoContent}>
      <AppText style={styles.infoLabel}>{label}</AppText>
      <AppText style={styles.infoValue}>{value || "-"}</AppText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1565c0",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  tabWrapper: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#E8EAF6",
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 6,
  },
  tabActive: {
    backgroundColor: "#1565c0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
    textAlign: "center",
  },
  tabTextActive: {
    color: COLORS.white,
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: "#1565c0",
    borderRadius: 16,
    padding: 24,
    marginBottom: SPACING.l,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  summaryLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1565c0",
    marginBottom: SPACING.s,
    marginTop: SPACING.s,
  },
  card: {
    padding: 4,
    marginBottom: SPACING.s,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E8EAF6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: "#999",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
  },
});

export default PerformaScreen;