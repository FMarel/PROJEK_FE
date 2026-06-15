import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "@/store/useAuthStore";
import { useJadwal } from "@/hooks/useJadwal";
import { AppText } from "@/components/ui/AppText";

const JadwalScreen = () => {
  const navigation = useNavigation();
  const [activeTingkat, setActiveTingkat] = useState(null);
  const nim = useAuthStore((state) => state.nim);
  const { jadwal, fetchJadwal } = useJadwal();

  const angkatan = Number(nim?.substring(2, 6));
  const tingkatAktif = Math.min(
    Math.max(new Date().getFullYear() - angkatan + 1, 1),
    4
  );

  const tingkatList = Array.from(
    { length: tingkatAktif },
    (_, i) => String(i + 1)
  );

  useEffect(() => {
    const loadData = async () => {
      if (!nim) return;
      await fetchJadwal({
        nim,
        roleAkses: "ROL23",
        status: "Final",
        urut: 1,
      });
      setActiveTingkat("1");
    };
    loadData();
  }, [nim]);

  const filteredJadwal = jadwal.filter(
    (item) => item.tingkat === activeTingkat
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>Jadwal Perkuliahan</AppText>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {tingkatList.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setActiveTingkat(item)}
              style={[styles.chip, activeTingkat === item && styles.chipActive]}
            >
              <AppText style={[styles.chipText, activeTingkat === item && styles.chipTextActive]}>
                Tingkat {item}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {activeTingkat && (
          <View style={styles.semesterContainer}>
            {filteredJadwal.length > 0 ? (
              filteredJadwal.map((item) => {
                const isGanjil = item.semester.toLowerCase().includes("ganjil");
                return (
                  <TouchableOpacity
                    key={item.jadId}
                    style={styles.semesterCard}
                    onPress={() => navigation.navigate("JadwalDetail", {
                      jadId: item.jadId,
                      semester: item.semester,
                      tingkat: item.tingkat,
                    })}
                  >
                    <View style={[styles.semesterBadge, isGanjil ? styles.badgeGanjil : styles.badgeGenap]}>
                      <Ionicons 
                        name="calendar-outline" 
                        size={24} 
                        color={isGanjil ? "#1E40AF" : "#3F6212"} 
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <AppText style={styles.semesterTitle}>{item.semester}</AppText>
                      <AppText style={styles.semesterSub}>
                        Tingkat {item.tingkat} · Tahun Ajaran {item.tahunAjaran}
                      </AppText>
                    </View>

                    <Ionicons name="chevron-forward" size={22} color="#94A3B8" />
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="calendar-outline" size={48} color="#CBD5E1" />
                <AppText style={styles.emptyStateText}>Tidak ada jadwal untuk tingkat ini.</AppText>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F1F5F9" 
  },
  content: { 
    padding: 16 
  },
  header: { 
    backgroundColor: "#0D47A1", 
    paddingTop: 52, 
    paddingBottom: 18, 
    paddingHorizontal: 16, 
    flexDirection: "row", 
    alignItems: "center", 
    borderBottomLeftRadius: 24, 
    borderBottomRightRadius: 24 
  },
  backButton: { 
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    backgroundColor: "rgba(255,255,255,0.15)", 
    justifyContent: "center", 
    alignItems: "center", 
    marginRight: 12 
  },
  headerTitle: { 
    color: "#FFFFFF", 
    fontSize: 20, 
    fontWeight: "700" 
  },
  chipRow: { 
    gap: 8, 
    paddingVertical: 16 
  },
  chip: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 18, 
    borderWidth: 1, 
    borderColor: "#CBD5E1", 
    backgroundColor: "#FFFFFF" 
  },
  chipActive: { 
    backgroundColor: "#172B6C", 
    borderColor: "#172B6C" 
  },
  chipText: { 
    fontSize: 13, 
    fontWeight: "600", 
    color: "#334155" 
  },
  chipTextActive: { 
    color: "#FFFFFF" 
  },
  semesterContainer: { 
    marginTop: 8 
  },
  semesterCard: { 
    backgroundColor: "#FFFFFF", 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12, 
    flexDirection: "row", 
    alignItems: "center", 
    borderWidth: 1, 
    borderColor: "#F1F5F9" 
  },
  semesterBadge: { 
    width: 52, 
    height: 52, 
    borderRadius: 12, 
    justifyContent: "center", 
    alignItems: "center", 
    marginRight: 16 
  },
  badgeGanjil: { 
    backgroundColor: "#EFF6FF" 
  },
  badgeGenap: { 
    backgroundColor: "#F7FEE7" 
  },
  semesterTitle: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#1E293B" 
  },
  semesterSub: { 
    fontSize: 13, 
    color: "#64748B", 
    marginTop: 4 
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
});

export default JadwalScreen;