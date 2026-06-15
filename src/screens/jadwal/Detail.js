import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/ui/AppText";
import { siaMobileServices } from "@/services/siaMobileServices";
import { useAuthStore } from "@/store/useAuthStore";

const DAYS = ["Semua", "Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

const getDayName = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", { weekday: "long" });
};

const splitTime = (time = "") => {
  const [start = "-", end = "-"] = time.split(" - ");
  return { start, end };
};

const cleanText = (text = "") => {
  return text.replace(/<br\s*\/?>/g, ", ");
};

const JadwalDetailScreen = ({ route, navigation }) => {
  const { jadId, semester, tingkat } = route.params;
  const nim = useAuthStore((state) => state.nim);
  const [activeDay, setActiveDay] = useState("Semua");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await siaMobileServices.getJadwalDetail(jadId, {
        role: "ROL23",
        username: nim,
        status: "Final",
      });
      setData(response?.data || []);
    } finally {
      setLoading(false);``
    }
  };

  useEffect(() => {
    if (nim) fetchDetail();
  }, [nim, semester, tingkat]);

  const filteredData = data.filter((item) => {
    if (activeDay === "Semua") return true;
    return getDayName(item.tanggal).toLowerCase() === activeDay.toLowerCase();
  });
  
const totalSks = filteredData.reduce((total, item) => total + (item.mkuSks || 0), 0);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.jdeId.toString()}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchDetail} />}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            {/* Header Utama */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <AppText style={styles.headerTitle}>Jadwal Semester {semester}</AppText>
            </View>

            {/* Summary Cards */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <AppText style={styles.summaryValue}>{filteredData.length}</AppText>
                <AppText style={styles.summaryLabel}>Mata Kuliah</AppText>
              </View>
              <View style={styles.summaryCard}>
                <AppText style={styles.summaryValue}>{totalSks}</AppText>
                <AppText style={styles.summaryLabel}>Total SKS</AppText>
              </View>
            </View>

            {/* Filter Hari */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayRow}>
              {DAYS.map((day) => (
                <TouchableOpacity
                  key={day}
                  onPress={() => setActiveDay(day)}
                  style={[styles.dayChip, activeDay === day && styles.dayChipActive]}
                >
                  <AppText style={[styles.dayText, activeDay === day && styles.dayTextActive]}>
                    {day}
                  </AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        }
        renderItem={({ item }) => {
          const { start, end } = splitTime(item.jdeTime);
          return (
            <View style={styles.cardWrapper}>
              <View style={styles.lessonCard}>
                <View style={styles.timeSection}>
                  <AppText style={styles.timeStart}>{start}</AppText>
                  <View style={styles.verticalLine} />
                  <AppText style={styles.timeEnd}>{end}</AppText>
                </View>

                <View style={styles.infoSection}>
                  <AppText style={styles.lessonTitle}>{item.namaMatakuliah || item.mkuNama}</AppText>
                  <View style={styles.metaRow}>
                    <Ionicons name="location-outline" size={14} color="#64748B" />
                    <AppText style={styles.lessonMeta}> {item.ruaNama} </AppText>
                    <View style={styles.sksBadge}>
                      <AppText style={styles.sksText}>{item.mkuSks} SKS</AppText>
                    </View>
                  </View>
                  <View style={styles.dosenBadge}>
                    <View style={styles.initialsBox}><AppText style={styles.initialsText}>RI</AppText></View>
                    <AppText style={styles.dosenText}>{cleanText(item.jdeDos)}</AppText>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={40} color="#CBD5E1" />
            <AppText style={styles.emptyText}>Tidak ada jadwal.</AppText>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#EEF4FC" 
  },
  content: { 
    paddingBottom: 32 
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
    marginBottom: 10 
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
    flex: 1, 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "800" 
  },
  dayRow: { 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    gap: 8 
  },
  dayChip: { 
    backgroundColor: "#fff", 
    borderRadius: 18, 
    paddingHorizontal: 18, 
    paddingVertical: 8, 
    borderWidth: 1, 
    borderColor: "#DBEAFE" 
  },
  dayChipActive: { 
    backgroundColor: "#0D47A1", 
    borderColor: "#0D47A1" 
  },
  dayText: { 
    fontSize: 13, 
    fontWeight: "600", 
    color: "#64748B" 
  },
  dayTextActive: { 
    color: "#fff" 
  },
  cardWrapper: { 
    paddingHorizontal: 16, 
    marginBottom: 12 
  },
  lessonCard: { 
    flexDirection: "row", 
    backgroundColor: "#fff", 
    padding: 16, 
    borderRadius: 14, 
    borderWidth: 1, 
    borderColor: "#BFDBFE" 
  },
  timeSection: { 
    width: 50, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  verticalLine: { 
    width: 1, 
    flex: 1, 
    backgroundColor: "#E2E8F0", 
    marginVertical: 4 
  },
  timeStart: { 
    fontSize: 13, 
    fontWeight: "700", 
    color: "#147DD8" 
  },
  timeEnd: { 
    fontSize: 13, 
    fontWeight: "700", 
    color: "#147DD8" 
  },
  infoSection: { 
    flex: 1, 
    marginLeft: 12 
  },
  lessonTitle: { 
    fontSize: 16, 
    fontWeight: "800", 
    color: "#0F172A", 
    marginBottom: 6 
  },
  metaRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 8 
  },
  lessonMeta: { 
    fontSize: 12, 
    color: "#64748B" 
  },
  sksBadge: { 
    backgroundColor: "#EFF6FF", 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 6, 
    marginLeft: 6 
  },
  sksText: { 
    fontSize: 11, 
    fontWeight: "600", 
    color: "#1D4ED8" 
  },
  initialsBox: { 
    backgroundColor: "#DBEAFE", 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    justifyContent: "center", 
    alignItems: "center", 
    marginRight: 8 
  },
  initialsText: { 
    fontSize: 10, 
    fontWeight: "bold", 
    color: "#1D4ED8" 
  },
  dosenBadge: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#F1F5F9", 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 8, 
    alignSelf: "flex-start" 
  },
  dosenText: { 
    fontSize: 12, 
    color: "#334155", 
    fontWeight: "600" 
  },
  empty: { 
    alignItems: "center", 
    paddingVertical: 50 
  },
  emptyText: { 
    marginTop: 8, 
    fontSize: 13, 
    color: "#94A3B8" 
  },
  summaryRow: { 
    flexDirection: "row", 
    gap: 12, 
    paddingHorizontal: 16, 
    marginTop: 16 
  },
  summaryCard: { 
    flex: 1, 
    backgroundColor: "#fff", 
    borderRadius: 14, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: "#BFDBFE" 
  },
  summaryValue: { 
    fontSize: 26, 
    fontWeight: "800", 
    color: "#147DD8" 
  },
  summaryLabel: { 
    fontSize: 12, 
    color: "#64748B", 
    marginTop: 4 
  },
});

export default JadwalDetailScreen;