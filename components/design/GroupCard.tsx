import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useSettingsStore } from "../../store/useSettingsStore";
import { PassCBTTheme } from "../../constants/theme";
import { CircularProgress } from "./CircularProgress";
import { PassCBTIcon, PassCBTIconName } from "./PassCBTSvgIcons";

interface GroupCardProps {
  title: string;
  subtitle: string;
  icon?: PassCBTIconName | string;
  progress: number;
  iconBg?: string;
  accentColor?: string;
  onPress?: () => void;
}

export function GroupCard({
  title,
  subtitle,
  icon = "book",
  progress,
  iconBg = "rgba(95, 51, 225, 0.12)",
  accentColor = "#5F33E1",
  onPress,
}: GroupCardProps) {
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme !== "light";
  const colors = isDark ? PassCBTTheme.dark : PassCBTTheme.light;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <PassCBTIcon
          name={(icon as PassCBTIconName) || "book"}
          size={20}
          color={accentColor}
        />
      </View>

      <View style={styles.textWrap}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
      </View>

      <View style={styles.progressWrap}>
        <CircularProgress
          percentage={progress}
          size={moderateScale(44)}
          strokeWidth={moderateScale(3.5)}
          color={accentColor}
          trackColor={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}
          textColor={colors.text}
          fontSize={moderateScale(10)}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(14),
    borderRadius: moderateScale(18),
    borderWidth: 1,
    marginBottom: moderateScale(10),
  },
  iconWrap: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(14),
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(14),
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.bold,
    marginBottom: moderateScale(3),
  },
  subtitle: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.regular,
  },
  progressWrap: {
    marginLeft: moderateScale(10),
  },
});
