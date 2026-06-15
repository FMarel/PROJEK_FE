import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useProfilMahasiswa } from "@/hooks/useProfil";
import { AppText } from "@/components/ui/AppText";
import { AppCard } from "@/components/ui/AppCard";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { COLORS, SPACING } from "@/constants/theme";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  GraduationCap,
  Users,
  Shield,
  Flag,
  Heart,
} from "lucide-react-native";

const ProfilScreen = () => {
  const navigation = useNavigation();
  const { data, isLoading, isError, refetch, isFetching } =
    useProfilMahasiswa();

  const profil = data?.data;

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
              <User size={24} color={COLORS.white} />
            </View>
            <View>
              <AppText style={styles.headerTitle}>Profil</AppText>
              <AppText style={styles.headerSubtitle}>Memuat...</AppText>
            </View>
          </View>
        </View>
        <View style={{ padding: 20 }}>
          <SkeletonLoader width={120} height={120} style={styles.avatarSkeleton} />
          <SkeletonLoader width="60%" height={24} style={{ marginBottom: 12 }} />
          <SkeletonLoader width="40%" height={16} style={{ marginBottom: 20 }} />
          <SkeletonLoader width="100%" height={100} style={{ marginBottom: 12 }} />
          <SkeletonLoader width="100%" height={100} />
        </View>
      </View>
    );
  }

  if (isError || !profil) {
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
              <User size={24} color={COLORS.white} />
            </View>
            <View>
              <AppText style={styles.headerTitle}>Profil</AppText>
              <AppText style={styles.headerSubtitle}>Error</AppText>
            </View>
          </View>
        </View>
        <View style={styles.center}>
          <AppText style={{ color: COLORS.danger, fontSize: 16 }}>
            Data profil tidak ditemukan
          </AppText>
          <AppText onPress={() => refetch()} style={styles.retryText}>
            Coba Lagi
          </AppText>
        </View>
      </View>
    );
  }

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
            <User size={24} color={COLORS.white} />
          </View>
          <View>
            <AppText style={styles.headerTitle}>Profil Mahasiswa</AppText>
            <AppText style={styles.headerSubtitle}>
              {profil.nim || "-"}
            </AppText>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={["#1A237E"]}
          />
        }
      >
        {/* Avatar & Nama */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {profil.foto ? (
              <Image
                source={{ uri: profil.foto }}
                style={styles.avatar}
              />
            ) : (
              <GraduationCap size={50} color="#1A237E" />
            )}
          </View>
          <AppText style={styles.nama}>{profil.nama || "-"}</AppText>
          <AppText style={styles.nim}>{profil.nim || "-"}</AppText>
          <View style={styles.statusBadge}>
            <AppText style={styles.statusText}>
              {profil.status || "Aktif"}
            </AppText>
          </View>
        </View>

        {/* Informasi Pribadi */}
        <AppText style={styles.sectionTitle}>Informasi Pribadi</AppText>
        <AppCard style={styles.card}>
          <InfoRow
            icon={<Mail size={18} color="#1A237E" />}
            label="Email"
            value={profil.email || "-"}
          />
          <InfoRow
            icon={<Phone size={18} color="#1A237E" />}
            label="No. HP"
            value={profil.noHp || "-"}
          />
          <InfoRow
            icon={<MapPin size={18} color="#1A237E" />}
            label="Alamat"
            value={profil.alamat || "-"}
          />
          <InfoRow
            icon={<Calendar size={18} color="#1A237E" />}
            label="Tanggal Lahir"
            value={
              profil.tanggalLahir && !profil.tanggalLahir.startsWith("0001")
                ? new Date(profil.tanggalLahir).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "-"
            }
          />
          <InfoRow
            icon={<MapPin size={18} color="#1A237E" />}
            label="Tempat Lahir"
            value={profil.tempatLahir || "-"}
            isLast
          />
        </AppCard>

        {/* Informasi Akademik */}
        <AppText style={styles.sectionTitle}>Informasi Akademik</AppText>
        <AppCard style={styles.card}>
          <InfoRow
            icon={<BookOpen size={18} color="#1A237E" />}
            label="Program Studi"
            value={profil.programStudi || "-"}
          />
          <InfoRow
            icon={<Users size={18} color="#1A237E" />}
            label="Dosen Wali"
            value={profil.dosenWali || "-"}
          />
          <InfoRow
            icon={<GraduationCap size={18} color="#1A237E" />}
            label="Kelas"
            value={profil.kelas || "-"}
            isLast
          />
        </AppCard>

        {/* Informasi Lainnya */}
        <AppText style={styles.sectionTitle}>Informasi Lainnya</AppText>
        <AppCard style={styles.card}>
          <InfoRow
            icon={<Heart size={18} color="#1A237E" />}
            label="Agama"
            value={profil.agama || "-"}
          />
          <InfoRow
            icon={<Shield size={18} color="#1A237E" />}
            label="Jenis Kelamin"
            value={profil.jenisKelamin || "-"}
          />
          <InfoRow
            icon={<Flag size={18} color="#1A237E" />}
            label="Kewarganegaraan"
            value={profil.kewargaNegaraan || "-"}
            isLast
          />
        </AppCard>
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
  avatarSection: {
    alignItems: "center",
    marginBottom: SPACING.l,
    marginTop: SPACING.s,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8EAF6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarSkeleton: {
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 16,
  },
  nama: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    marginBottom: 4,
  },
  nim: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2E7D32",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A237E",
    marginBottom: SPACING.s,
    marginTop: SPACING.m,
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    gap: 12,
  },
  retryText: {
    color: COLORS.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginTop: 8,
  },
});

export default ProfilScreen;