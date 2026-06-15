import React from "react";

import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";

import { WebView } from "react-native-webview";

import {
  ChevronLeft,
} from "lucide-react-native";

import {
  COLORS,
  SPACING,
} from "@/constants/theme";

const PdfWebViewScreen = ({
  navigation,
  route,
}) => {
  const { pdfUrl } = route.params;

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

      <WebView
        source={{
          uri:pdfUrl
        }}
        style={styles.webview}
        startInLoadingState
      />

    </View>
  );
};

export default PdfWebViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  header: {
    backgroundColor: "#0D47A1",

    paddingTop: 52,

    paddingBottom: 18,

    paddingHorizontal: SPACING.m,

    flexDirection: "row",

    alignItems: "center",
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

  webview: {
    flex: 1,
  },
});