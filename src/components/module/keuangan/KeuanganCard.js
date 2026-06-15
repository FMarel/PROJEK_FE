import { AppCard } from "@/components/ui/AppCard";
import { AppText } from "@/components/ui/AppText";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import React from "react";
import { View, StyleSheet } from "react-native";

const formatRupiah = (value) => {
  const number = Number(value || 0);
  return `Rp ${number.toLocaleString("id-ID")}`;
};

export const KeuanganCard = ({ item }) => {
  const sisaTagihan = Number(item.tagihan || 0) - Number(item.pembayaran || 0);
  const isLunas = sisaTagihan <= 0;

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Ionicons
            name={isLunas ? "checkmark-circle" : "wallet-outline"}
            size={22}
            color={isLunas ? "#16A34A" : "#2563EB"}
          />
        </View>

        <View style={styles.info}>
          <AppText style={styles.title}>{item.jenis || "Tagihan"}</AppText>
          <AppText style={styles.date}>
            Batas Bayar: {item.batasBayar || "-"}
          </AppText>
        </View>

        <View
          style={[
            styles.badge,
            isLunas ? styles.badgeLunas : styles.badgeBelumLunas,
          ]}
        >
          <AppText
            style={[
              styles.badgeText,
              isLunas ? styles.textLunas : styles.textBelumLunas,
            ]}
          >
            {isLunas ? "Lunas" : "Belum Lunas"}
          </AppText>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.amountBox}>
        <View style={styles.amountCard}>
          <AppText style={styles.amountLabel}>Tagihan</AppText>
          <AppText style={styles.amountValue}>
            {formatRupiah(item.tagihan)}
          </AppText>
        </View>

        <View style={styles.amountCard}>
          <AppText style={styles.amountLabel}>Dibayar</AppText>
          <AppText style={styles.paidValue}>
            {formatRupiah(item.pembayaran)}
          </AppText>
        </View>
      </View>

      {!!item.keterangan && (
        <AppText style={styles.note}>{item.keterangan}</AppText>
      )}
    </AppCard>
  );
};

KeuanganCard.propTypes = {
  item: PropTypes.shape({
    rowNumber: PropTypes.number,
    id: PropTypes.number,
    tanggal: PropTypes.string,
    jenis: PropTypes.string,
    batasBayar: PropTypes.string,
    tagihan: PropTypes.number,
    pembayaran: PropTypes.number,
    keterangan: PropTypes.string,
  }).isRequired,
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  info: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1E293B",
  },

  date: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },

  badgeLunas: {
    backgroundColor: "#DCFCE7",
  },

  badgeBelumLunas: {
    backgroundColor: "#FEF3C7",
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "800",
  },

  textLunas: {
    color: "#16A34A",
  },

  textBelumLunas: {
    color: "#D97706",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 14,
  },

  amountBox: {
    flexDirection: "row",
    gap: 10,
  },

  amountCard: {
    flex: 1,
    backgroundColor: "#F8FBFF",
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  amountLabel: {
    fontSize: 11,
    color: "#111827",
    marginBottom: 4,
    fontWeight: "600",
  },

  amountValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1E293B",
  },

  paidValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#00A884",
  },

  note: {
    marginTop: 10,
    fontSize: 12,
    color: "#64748B",
  },
});