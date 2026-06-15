import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { FileText } from "lucide-react-native";

import {
  COLORS,
  SPACING,
} from "@/constants/theme";

const BukuPedomanCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <FileText
          size={28}
          color={COLORS.white}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.subtitle}>
          PDF • {item.fileSize}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default BukuPedomanCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: SPACING.m,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.l,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.m,
  },

  infoContainer: {
    flex: 1,
  },

  title: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  subtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },
});