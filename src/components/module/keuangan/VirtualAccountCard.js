import { AppCard } from "@/components/ui/AppCard";
import { AppText } from "@/components/ui/AppText";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import React from "react";
import { View, StyleSheet } from "react-native";

const vaLabels = {
  sumbangan: "Sumbangan",
  spp: "SPP",
  wisuda: "Wisuda",
  cuti: "Cuti",
  idCard: "ID Card",
  lainnya: "Lainnya",
  dormitory: "Dormitory",
};

export const VirtualAccountCard = ({ data }) => {
  const items = Object.entries(vaLabels)
    .map(([key, label]) => ({
      key,
      label,
      value: data?.[key],
    }))
    .filter((item) => item.value);

  if (items.length === 0) return null;

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="card-outline" size={20} color="#2563EB" />

        <AppText style={styles.title}>
          Virtual Account
        </AppText>
      </View>

      {items.map((item) => (
        <View key={item.key} style={styles.row}>
          <AppText style={styles.label}>
            {item.label}
          </AppText>

          <AppText style={styles.value}>
            {item.value}
          </AppText>
        </View>
      ))}
    </AppCard>
  );
};

VirtualAccountCard.propTypes = {
  data: PropTypes.object,
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  title: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1E293B",
  },

  row: {
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  label: {
    fontSize: 11,
    color: "#94A3B8",
    marginBottom: 2,
  },

  value: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
});