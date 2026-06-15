import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { COLORS, SPACING } from "@/constants/theme";
import { useKalenderAkademik } from "@/hooks/useKalenderAkademik";

dayjs.locale("id");

// ─── Helper: kategori event ────────────────────────────────────────────────────

const getEventType = (kegiatan = "") => {
  const text = kegiatan.toLowerCase();

  if (text.includes("libur")) {
    return {
      bg:     "#FEE2E2",
      border: "#EF4444",
      text:   "#DC2626",
      label:  "LIBUR NASIONAL",
      dot:    "#EF4444",
    };
  }

  if (
    text.includes("uts") ||
    text.includes("uas") ||
    text.includes("ujian")
  ) {
    return {
      bg:     "#DBEAFE",
      border: "#2563EB",
      text:   "#1D4ED8",
      label:  "UJIAN",
      dot:    "#2563EB",
    };
  }

  return {
    bg:     "#DCFCE7",
    border: "#22C55E",
    text:   "#15803D",
    label:  "AKADEMIK",
    dot:    "#22C55E",
  };
};

// ─── Main Screen ───────────────────────────────────────────────────────────────

const KalenderAkademikScreen = ({ navigation }) => {
  const { data, isLoading } = useKalenderAkademik();

  const today = dayjs().format("YYYY-MM-DD");

  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"));

  // ── markedDates ──────────────────────────────────────────────────────────
  const markedDates = useMemo(() => {
    const marked = {};

    data?.data?.forEach((item) => {
      const date = dayjs(item.tanggalMulai).format("YYYY-MM-DD");
      const type = getEventType(item.kegiatan);
      marked[date] = {
        marked:   true,
        dotColor: type.dot,
      };
    });

    // selectedDate di luar forEach
    marked[selectedDate] = {
      ...(marked[selectedDate] || {}),
      selected:      true,
      selectedColor: "#1565C0",
    };

    return marked;
  }, [data, selectedDate]);

  // ── Agenda bulan aktif ────────────────────────────────────────────────────
  const selectedEvents = useMemo(() => {
    return (
      data?.data?.filter((item) => {
        const month = dayjs(item.tanggalMulai).format("YYYY-MM");
        return month === currentMonth;
      }) ?? []
    );
  }, [data, currentMonth]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // ── Main ──────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>

      {/* Header — tidak diubah */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kalender Akademik</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Kalender */}
        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={markedDates}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            onMonthChange={(month) => {
              setCurrentMonth(
                dayjs(
                  `${month.year}-${String(month.month).padStart(2, "0")}-01`
                ).format("YYYY-MM")
              );
            }}
            theme={{
              backgroundColor:            "#ffffff",
              calendarBackground:         "#ffffff",
              todayTextColor:             "#1565C0",
              selectedDayBackgroundColor: "#1565C0",
              selectedDayTextColor:       "#ffffff",
              textDayFontWeight:          "500",
              textMonthFontWeight:        "700",
              textMonthFontSize:          18,
              textDayHeaderFontWeight:    "700",
              arrowColor:                 "#1565C0",
              monthTextColor:             "#1E293B",
              textDayStyle:               { color: "#334155" },
            }}
            renderArrow={(direction) =>
              direction === "left" ? (
                <ChevronLeft size={18} color="#1565C0" />
              ) : (
                <ChevronRight size={18} color="#1565C0" />
              )
            }
          />

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={styles.todayDot} />
              <Text style={styles.legendText}>Hari ini</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.eventDot} />
              <Text style={styles.legendText}>Agenda Akademik</Text>
            </View>
          </View>
        </View>

        {/* Section title */}
        <Text style={styles.sectionTitle}>AGENDA MENDATANG</Text>

        {/* Agenda list */}
        <View style={styles.agendaContainer}>
          {selectedEvents.length > 0 ? (
            selectedEvents.map((item, index) => {
              const type = getEventType(item.kegiatan);
              return (
                <View
                  key={index}
                  style={[styles.agendaCard, { borderLeftColor: type.border }]}
                >
                  {/* Date box */}
                  <View style={[styles.dateBox, { backgroundColor: type.bg }]}>
                    <Text style={[styles.dateDay, { color: type.text }]}>
                      {dayjs(item.tanggalMulai).format("DD")}
                    </Text>
                    <Text style={[styles.dateMonth, { color: type.text }]}>
                      {dayjs(item.tanggalMulai).format("MMM")}
                    </Text>
                  </View>

                  {/* Content */}
                  <View style={styles.agendaContent}>
                    <View style={[styles.badge, { backgroundColor: type.bg }]}>
                      <Text style={[styles.badgeText, { color: type.text }]}>
                        {type.label}
                      </Text>
                    </View>
                    <Text style={styles.eventTitle}>{item.kegiatan}</Text>
                    <Text style={styles.eventDate}>
                      {dayjs(item.tanggalMulai).format("DD MMMM YYYY")}
                    </Text>
                    {!!item.keterangan && (
                      <Text style={styles.eventDesc}>{item.keterangan}</Text>
                    )}
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyText}>Tidak ada agenda bulan ini.</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
};

export default KalenderAkademikScreen;

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F7FB" },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Header — tidak diubah
  header: {
    backgroundColor: "#0D47A1",
    paddingTop: 52,
    paddingBottom: 18,
    paddingHorizontal: SPACING.m,
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
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: "700" },

  // Calendar
  calendarContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.m,
    marginTop: -10,
    borderRadius: 24,
    paddingBottom: SPACING.m,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  // Legend
  legendContainer: {
    flexDirection: "row",
    paddingHorizontal: SPACING.m,
    marginTop: 10,
    gap: 16,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  todayDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#1565C0" },
  eventDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#90CAF9" },
  legendText: { fontSize: 12, color: COLORS.gray },

  // Section
  sectionTitle: {
    marginHorizontal: SPACING.m,
    marginBottom: 10,
    marginTop: 16,
    color: "#607D8B",
    fontWeight: "700",
    fontSize: 13,
  },

  // Agenda
  agendaContainer: {
    marginHorizontal: SPACING.m,
    marginBottom: 40,
    gap: 12,
  },
  agendaCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    overflow: "hidden",
    padding: SPACING.m,
    flexDirection: "row",
    alignItems: "flex-start",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  // Date box
  dateBox: {
    width: 56, height: 64,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    flexShrink: 0,
  },
  dateDay: { fontSize: 20, fontWeight: "700", lineHeight: 24 },
  dateMonth: { fontSize: 11, fontWeight: "600", marginTop: 2, textTransform: "uppercase" },

  // Content
  agendaContent: { flex: 1, gap: 4 },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 4,
  },
  badgeText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.3 },
  eventTitle: { fontSize: 15, fontWeight: "700", color: "#1E293B", lineHeight: 21 },
  eventDate: { fontSize: 12, color: "#64748B", marginTop: 2, lineHeight: 17 },
  eventDesc: { fontSize: 12, color: COLORS.gray, lineHeight: 18, marginTop: 2 },

  // Empty
  emptyWrap: { alignItems: "center", paddingVertical: 32, gap: 8 },
  emptyIcon: { fontSize: 36 },
  emptyText: { color: COLORS.gray, fontSize: 13, textAlign: "center" },
}); 