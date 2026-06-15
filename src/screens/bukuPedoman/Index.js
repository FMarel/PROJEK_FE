import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";

import * as FileSystem
from "expo-file-system";

import * as Sharing
from "expo-sharing";

import * as WebBrowser from "expo-web-browser"; 

import {
  BookOpen,
  ChevronLeft,
  Download,
} from "lucide-react-native";

import {
  COLORS,
  SPACING,
} from "@/constants/theme";

import { useBukuPedoman }
from "@/hooks/useBukuPedoman";

import BukuPedomanCard
from "@/components/module/BukuPedomanCard";

const BukuPedomanScreen = ({
  navigation,
}) => {

  const {
    data,
    isLoading,
    isError,
  } = useBukuPedoman();

  const buku = data?.[0];

  const handleOpenPdf = async () => {
  try {
    console.log(
      "PDF URL:",
      buku.fileUrl
    );

    await WebBrowser.openBrowserAsync(
      buku.fileUrl
    );
  } catch (error) {
    console.log(error);

    Alert.alert(
      "Error",
      "Gagal membuka PDF"
    );
  }
};

  const handleDownload =
    async () => {
      try {

        const fileUri =
          FileSystem.documentDirectory +
          `${buku.title}.pdf`;

        const downloadResult =
          await FileSystem.downloadAsync(
            buku.fileUrl,
            fileUri
          );

        await Sharing.shareAsync(
          downloadResult.uri
        );

      } catch (error) {

        Alert.alert(
          "Error",
          "Gagal download PDF"
        );

      }
    };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />
      </View>
    );
  }

  if (isError || !buku) {
    return (
      <View style={styles.center}>
        <Text>
          Buku pedoman tidak tersedia.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
        >
          <ChevronLeft
            size={22}
            color={COLORS.white}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Buku Pedoman
        </Text>

      </View>

      <BukuPedomanCard item={buku} />

      <View style={styles.previewCard}>

        <BookOpen
          size={70}
          color="#5E92F3"
        />

        <Text style={styles.previewTitle}>
          Buku pedoman siap dibaca.
        </Text>

        <Text style={styles.previewDesc}>
          Ketuk tombol di bawah
          untuk membuka.
        </Text>   

        <TouchableOpacity
          style={styles.openButton}
          onPress={handleOpenPdf}
        >
          <Text style={styles.openButtonText}>
            Buka PDF
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            styles.downloadButton
          }
          onPress={
            handleDownload
          }
        >

          <Download
            size={18}
            color="#1565C0"
          />

          <Text
            style={
              styles.downloadText
            }
          >
            Download PDF
          </Text>

        </TouchableOpacity>

      </View>

    </View>
  );
};

export default BukuPedomanScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

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
    width: 38,

    height: 38,

    borderRadius: 12,

    backgroundColor:
      "rgba(255,255,255,0.15)",

    justifyContent: "center",

    alignItems: "center",

    marginRight: 12,
  },

  headerTitle: {
    color: COLORS.white,

    fontSize: 20,

    fontWeight: "700",
  },

  previewCard: {
    flex: 1,

    backgroundColor:
      COLORS.white,

    margin: SPACING.m,

    borderRadius: 28,

    justifyContent: "center",

    alignItems: "center",

    padding: SPACING.xl,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.06,

    shadowRadius: 8,

    elevation: 3,
  },

  previewTitle: {
    marginTop: 20,

    fontSize: 22,

    fontWeight: "700",

    color: "#1E293B",
  },

  previewDesc: {
    marginTop: 10,

    textAlign: "center",

    color: "#64748B",

    fontSize: 15,

    lineHeight: 22,
  },

  openButton: {
    marginTop: 28,

    backgroundColor: "#1565C0",

    paddingHorizontal: 36,

    paddingVertical: 14,

    borderRadius: 18,
  },

  openButtonText: {
    color: COLORS.white,

    fontSize: 16,

    fontWeight: "700",
  },

  downloadButton: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 18,
  },

  downloadText: {
    marginLeft: 8,

    color: "#1565C0",

    fontWeight: "700",
  },

});