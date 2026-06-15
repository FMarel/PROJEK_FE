import React from "react";
import { View, ScrollView, ActivityIndicator, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { COLORS } from "@/constants/theme";
import { useRpsDetail } from "@/hooks/useRpsDetail";
import { Ionicons } from "@expo/vector-icons";

const RpsDetail = ({ route, navigation }) => {
  const { rpsid, matakuliah, kelas } = route.params;
  const { header, details, isLoading } = useRpsDetail(rpsid, kelas);

  // Pastikan mengambil data sesuai struktur response
  const headerData = header || {};
  const materiData = details || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <AppText style={styles.topBarTitle} numberOfLines={1}>Detail RPS</AppText>
          {/* SINKRONISASI: headerData.semester (camelCase) */}
          <AppText style={styles.topBarSub}>Semester {headerData.semester || '-'}</AppText>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.mainCard}>
          <View style={styles.rowBetween}>
            {/* SINKRONISASI: headerData.mataKuliah (camelCase) */}
            <AppText style={styles.mainMkNama}>{headerData.mataKuliah || matakuliah}</AppText>
            <View style={styles.sksBadge}>
              <AppText style={styles.sksText}>{headerData.sks || 0} SKS</AppText>
            </View>
          </View>
          <AppText style={styles.mainMkDosen}>
             Kode MK: {headerData.kodeMataKuliah || '-'}
          </AppText>
          <View style={styles.tagContainer}>
            <View style={styles.tag}>
              <AppText style={styles.tagText}>{headerData.deskripsi || 'Detail Pertemuan'}</AppText>
            </View>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingArea}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <>
            <AppText style={styles.subTitle}>RENCANA PERTEMUAN</AppText>
            <View style={styles.cardWhite}>
              {materiData.length > 0 ? (
                materiData.map((item, i) => (
                  <View key={i} style={styles.materiRow}>
                    <View style={styles.mBadge}>
                      {/* SINKRONISASI: item.pertemuanKe (Sesuai Swagger) */}
                      <AppText style={styles.mBadgeText}>P{item.pertemuanKe}</AppText>
                    </View>
                    <View style={{ flex: 1 }}>
                      {/* SINKRONISASI: item.subCpmk (Sesuai Swagger) */}
                      <AppText style={styles.materiTitle}>{item.subCpmk}</AppText>
                      
                      <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={12} color="#8898AA" />
                        {/* SINKRONISASI: item.materi (Sesuai Swagger) */}
                        <AppText style={styles.materiSub}>{item.materi}</AppText>
                      </View>

                      <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={12} color="#007AFF" />
                        {/* SINKRONISASI: item.metodePembelajaran (Sesuai Swagger) */}
                        <AppText style={[styles.materiSub, { color: '#007AFF' }]}>{item.metodePembelajaran}</AppText>
                      </View>
                      
                      <View style={styles.tagMingguContainer}>
                        <View style={styles.tagMinggu}>
                          <AppText style={styles.tagMingguText}>
                            {/* SINKRONISASI: item.metodePenilaian (Sesuai Swagger) */}
                            <Ionicons name="star-outline" size={10} /> {item.metodePenilaian || item.penilaian}
                          </AppText>
                        </View>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <AppText style={{ color: '#8898AA' }}>Materi belum tersedia.</AppText>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  topBar: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, flexDirection: 'row', alignItems: 'center' },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 10, marginRight: 15 },
  topBarTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  topBarSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  mainCard: { backgroundColor: '#1E60BA', borderRadius: 20, padding: 20, margin: 20, elevation: 5 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  mainMkNama: { color: 'white', fontSize: 17, fontWeight: 'bold', flex: 1, marginRight: 10 },
  sksBadge: { backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  sksText: { color: '#1E60BA', fontSize: 10, fontWeight: 'bold' },
  mainMkDosen: { color: '#E0EFFF', fontSize: 13, marginTop: 8 },
  tagContainer: { flexDirection: 'row', marginTop: 15 },
  tag: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  tagText: { color: 'white', fontSize: 11 },
  subTitle: { fontSize: 11, fontWeight: 'bold', color: '#64748B', marginHorizontal: 25, marginBottom: 10, textTransform: 'uppercase' },
  cardWhite: { backgroundColor: 'white', marginHorizontal: 20, borderRadius: 20, elevation: 2 },
  materiRow: { flexDirection: "row", padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  mBadge: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  mBadgeText: { color: '#007AFF', fontWeight: 'bold' },
  materiTitle: { fontSize: 14, fontWeight: "700", color: "#1E293B", marginBottom: 5 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  materiSub: { fontSize: 12, color: "#64748B", marginLeft: 6, flex: 1 },
  tagMingguContainer: { marginTop: 10 },
  tagMinggu: { backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  tagMingguText: { color: '#166534', fontSize: 10, fontWeight: 'bold' },
  loadingArea: { marginTop: 100, alignItems: 'center' }
});

export default RpsDetail;