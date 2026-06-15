import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useInformasi } from "@/hooks/useInformasi";
import { AppText } from "@/components/ui/AppText";
import { Loader } from "@/components/common/Loader";
import { COLORS } from "@/constants/theme";
import {
  Megaphone,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Clock,
} from "lucide-react-native";

const InformasiScreen = () => {
  const navigation = useNavigation();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInformasi({ SearchKeyword: "" });

  const listData = useMemo(() => {
    return data?.pages?.flatMap((page) => page?.data || []) || [];
  }, [data]);

  const groupedByDate = useMemo(() => {
    const groups = {};
    listData.forEach((item) => {
      const date = item.date
        ? new Date(item.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "Tanpa Tanggal";

      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return groups;
  }, [listData]);

  const formatDate = (dateString) => {
    if (!dateString || dateString.startsWith("0001")) return null;
    const d = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "Hari ini";
    if (diff === 1) return "Kemarin";
    if (diff < 7) return `${diff} hari lalu`;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
            <View>
              <AppText style={styles.headerTitle}>Informasi</AppText>
              <AppText style={styles.headerSubtitle}>Memuat...</AppText>
            </View>
          </View>
        </View>
        <Loader />
      </View>
    );
  }

  if (isError) {
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
            <View>
              <AppText style={styles.headerTitle}>Informasi</AppText>
              <AppText style={styles.headerSubtitle}>Error</AppText>
            </View>
          </View>
        </View>
        <View style={styles.center}>
          <AppText style={styles.errorText}>
            Terjadi Kesalahan: {error.message}
          </AppText>
          <AppText onPress={() => refetch()} style={styles.retryText}>
            Coba Lagi
          </AppText>
        </View>
      </View>
    );
  }

  const totalData = data?.pages?.[0]?.totalData || 0;
  const groupedKeys = Object.keys(groupedByDate);

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color="#1565c0" />
          <AppText style={styles.loadingText}>Memuat data...</AppText>
        </View>
      );
    }
    if (!hasNextPage && listData.length > 0) {
      return (
        <View style={styles.loadingFooter}>
          <View style={styles.endLine} />
          <AppText style={styles.loadingText}>Semua pengumuman sudah ditampilkan</AppText>
          <View style={styles.endLine} />
        </View>
      );
    }
    return null;
  };

  const onEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("DetailInformasi", { id: item.id })
        }
        activeOpacity={0.7}
      >
        <View style={styles.card}>
          {/* Content */}
          <View style={styles.cardContent}>
            <AppText style={styles.cardTitle} numberOfLines={2}>
              {item.subyek || "Tanpa Judul"}
            </AppText>

            {item.isiPengumuman ? (
              <AppText style={styles.cardPreview} numberOfLines={1}>
                {item.isiPengumuman.replace(/<[^>]*>/g, "")}
              </AppText>
            ) : null}

            <View style={styles.cardFooter}>
              <View style={styles.footerLeft}>
                <Clock size={11} color="#999" />
                <AppText style={styles.footerText}>
                  {formatDate(item.date) || "-"}
                </AppText>
              </View>
            </View>
          </View>

          <ChevronRight size={18} color="#CCC" style={{ marginLeft: 4 }} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderDateHeader = (date) => (
    <View style={styles.dateHeader}>
      <View style={styles.dateDot} />
      <AppText style={styles.dateText}>{date}</AppText>
    </View>
  );

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
          <View>
            <AppText style={styles.headerTitle}>Informasi</AppText>
            <AppText style={styles.headerSubtitle}>
              {totalData} Pengumuman
            </AppText>
          </View>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={groupedKeys}
        keyExtractor={(item) => item}
        renderItem={({ item: date }) => (
          <View style={styles.dateGroup}>
            {renderDateHeader(date)}
            {groupedByDate[date].map((item) => (
              <View key={item.id}>{renderItem({ item })}</View>
            ))}
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isFetchingNextPage}
            onRefresh={refetch}
            colors={["#1565c0"]}
            tintColor="#1565c0"
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Megaphone size={40} color="#CCC" />
            </View>
            <AppText style={styles.emptyTitle}>Belum Ada Informasi</AppText>
            <AppText style={styles.emptyText}>
              Pengumuman dari kampus akan muncul di sini
            </AppText>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#1565c0",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  dateGroup: {
    marginBottom: 4,
  },
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 4,
    marginBottom: 10,
    marginTop: 16,
  },
  dateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1565c0",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#444",
    textTransform: "capitalize",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    lineHeight: 20,
  },
  cardPreview: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 11,
    color: "#999",
  },
  loadingFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 10,
    paddingHorizontal: 30,
  },
  endLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  loadingText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    padding: 20,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 10,
    textAlign: "center",
  },
  retryText: {
    color: "#1565c0",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#999",
    marginBottom: 6,
  },
  emptyText: {
    color: "#BBB",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default InformasiScreen;