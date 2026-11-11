import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { PassCBTTheme } from "../../constants/theme";
import { PassCBTIcon, PassCBTIconName } from "./PassCBTSvgIcons";

interface HorizontalSubjectCardProps {
  category: string;
  title: string;
  icon?: PassCBTIconName | string;
  progress: number;
  variant?: keyof typeof PassCBTTheme.pastels;
  onPress?: () => void;
}

export function HorizontalSubjectCard({
  category,
  title,
  icon,
  progress,
  variant = "blue",
  onPress,
}: HorizontalSubjectCardProps) {
  const pastel = PassCBTTheme.pastels[variant] || PassCBTTheme.pastels.blue;
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: pastel.bg }]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <Text style={[styles.categoryText, { color: "rgba(26, 27, 45, 0.6)" }]} numberOfLines={1}>
          {category}
        </Text>
        <View style={[styles.iconBadge, { backgroundColor: pastel.iconBg }]}>
          <PassCBTIcon
            name={(icon as PassCBTIconName) || "book"}
            size={14}
            color={pastel.bar}
          />
        </View>
      </View>

      <Text style={styles.titleText} numberOfLines={2}>
        {title}
      </Text>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: pastel.bar,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: moderateScale(190),
    borderRadius: moderateScale(20),
    padding: moderateScale(16),
    marginRight: moderateScale(14),
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(10),
  },
  categoryText: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.semiBold,
    flex: 1,
    paddingRight: moderateScale(6),
  },
  iconBadge: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    color: "#1A1B2D",
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.bold,
    lineHeight: moderateScale(20),
    minHeight: moderateScale(40),
    marginBottom: moderateScale(14),
  },
  track: {
    height: moderateScale(5),
    borderRadius: moderateScale(2.5),
    backgroundColor: "rgba(0, 0, 0, 0.06)",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: moderateScale(2.5),
  },
});
