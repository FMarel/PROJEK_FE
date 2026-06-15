import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { useDetailInformasi, useSetBacaInformasi } from "@/hooks/useInformasi";
import { AppText } from "@/components/ui/AppText";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { COLORS, SPACING } from "@/constants/theme";
import { Config } from "@/constants/config";
import PropTypes from "prop-types";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  AlertTriangle,
  Clock,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const DetailInformasiScreen = ({ route }) => {
  const { id } = route.params;
  const navigation = useNavigation();
  const { data, isLoading, isError } = useDetailInformasi(id);
  const { mutate: setBaca } = useSetBacaInformasi();
  const [webViewHeight, setWebViewHeight] = useState(0);

  const detail = data?.data;

  useEffect(() => {
    if (id) {
      setBaca({ id });
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString || dateString.startsWith("0001")) return null;
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getBaseUrl = () => {
    const apiUrl = Config.API_URL;
    return apiUrl?.replace("/api/", "/") || "";
  };

  const generateHtml = (content) => {
    const baseUrl = getBaseUrl();
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <style>
          * { margin: 0; padding-left: 5px; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 15px;
            color: #444;
            line-height: 1.8;
            padding: 0;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 12px auto;
            border-radius: 8px;
          }
          p { margin-bottom: 12px; }
          a { color: #1A237E; text-decoration: none; }
          table { width: 100%; border-collapse: collapse; margin: 12px 0; }
          td, th { border: 1px solid #ddd; padding: 8px; }
          ul, ol { padding-left: 20px; margin-bottom: 12px; }
          h1, h2, h3, h4, h5, h6 { margin-bottom: 12px; color: #222; }
        </style>
      </head>
      <body>
        ${content}
        <script>
          setTimeout(function() {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ height: document.body.scrollHeight })
            );
          }, 150);
        </script>
      </body>
      </html>
    `;
  };

  const onWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.height) {
        setWebViewHeight(data.height + 20);
      }
    } catch (e) {}
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
            <View style={styles.headerIcon}>
              <Calendar size={24} color={COLORS.white} />
            </View>
            <View>
              <AppText style={styles.headerTitle}>Detail</AppText>
              <AppText style={styles.headerSubtitle}>Memuat...</AppText>
            </View>
          </View>
        </View>
        <View style={{ padding: 20 }}>
          <SkeletonLoader width="80%" height={24} style={{ marginBottom: 16 }} />
          <SkeletonLoader width="100%" height={200} />
        </View>
      </View>
    );
  }

  if (isError || !detail) {
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
              <Calendar size={24} color={COLORS.white} />
            </View>
            <View>
              <AppText style={styles.headerTitle}>Detail</AppText>
              <AppText style={styles.headerSubtitle}>Error</AppText>
            </View>
          </View>
        </View>
        <View style={styles.center}>
          <AppText style={{ color: COLORS.danger, fontSize: 16 }}>
            Informasi tidak ditemukan
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
            <Calendar size={24} color={COLORS.white} />
          </View>
          <View>
            <AppText style={styles.headerTitle}>Detail Informasi</AppText>
            <AppText style={styles.headerSubtitle}>
              {detail.appNama || "Pengumuman"}
            </AppText>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Judul */}
        <AppText style={styles.title}>{detail.subyek || "Tanpa Judul"}</AppText>

        {/* Meta Info */}
        <View style={styles.metaContainer}>
          {detail.dari && !detail.dari.startsWith("0001") ? (
            <View style={styles.metaItem}>
              <User size={14} color="#666" />
              <AppText style={styles.metaText}>
                {detail.darif || detail.dari}
              </AppText>
            </View>
          ) : null}
          
        </View>

        {/* Wajib Badge */}
        {detail.wajib === 1 && (
          <View style={styles.wajibBadge}>
            <AlertTriangle size={16} color="#FF5722" />
            <AppText style={styles.wajibText}>Informasi Wajib</AppText>
          </View>
        )}

        {/* Periode */}
        {(detail.darif || detail.sampaif) && (
          <View style={styles.periodeContainer}>
            <Clock size={16} color="#1A237E" />
            <View style={{ flex: 1, marginLeft: 8 }}>
              {detail.darif && (
                <AppText style={styles.periodeText}>
                  Dari: {detail.darif}
                </AppText>
              )}
              {detail.sampaif && (
                <AppText style={styles.periodeText}>
                  Sampai: {detail.sampaif}
                </AppText>
              )}
            </View>
          </View>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Isi dengan WebView */}
        {detail.isiPengumuman ? (
          <View style={styles.webViewContainer}>
            <WebView
              originWhitelist={["*"]}
              source={{ html: generateHtml(detail.isiPengumuman) }}
              style={[styles.webView, { height: webViewHeight || 200 }]}
              scrollEnabled={false}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              onMessage={onWebViewMessage}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={styles.emptyContent}>
            <AppText style={styles.emptyContentText}>
              Tidak ada detail konten untuk informasi ini.
            </AppText>
          </View>
        )}

        
      </ScrollView>
    </View>
  );
};

DetailInformasiScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
  }).isRequired,
};

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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: SPACING.m,
    lineHeight: 28,
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: SPACING.s,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: "#666",
  },
  wajibBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: SPACING.m,
    alignSelf: "flex-start",
  },
  wajibText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FF5722",
  },
  periodeContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#E8EAF6",
    padding: SPACING.m,
    borderRadius: 12,
    marginTop: SPACING.m,
  },
  periodeText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: SPACING.m,
  },
  webViewContainer: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  webView: {
    backgroundColor: "transparent",
  },
  emptyContent: {
    backgroundColor: COLORS.white,
    padding: SPACING.l,
    borderRadius: 16,
    alignItems: "center",
  },
  emptyContentText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: "#E8EAF6",
    padding: SPACING.m,
    borderRadius: 12,
    marginTop: SPACING.m,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1A237E",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DetailInformasiScreen;