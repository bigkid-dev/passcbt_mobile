import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { moderateScale } from "react-native-size-matters";
import { useSettingsStore } from "../../store/useSettingsStore";
import { PassCBTTheme } from "../../constants/theme";
import { PassCBTIcon } from "./PassCBTSvgIcons";

interface PassCBTHeaderProps {
  title?: string;
  name?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function PassCBTHeader({
  title,
  name,
  showBack = false,
  onBack,
  rightAction,
}: PassCBTHeaderProps) {
  const router = useRouter();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme !== "light";
  const colors = isDark ? PassCBTTheme.dark : PassCBTTheme.light;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const initials = name
    ? name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "ST";

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: isDark ? colors.cardElevated : colors.card }]}
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <PassCBTIcon name="arrow-back" size={18} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.userWrap}>
          <View style={[styles.avatar, { backgroundColor: PassCBTTheme.brand.primary }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.greetingWrap}>
            <Text style={[styles.greetingLabel, { color: colors.textMuted }]}>Hello!</Text>
            <Text style={[styles.nameText, { color: colors.text }]} numberOfLines={1}>
              {name || "Student"}
            </Text>
          </View>
        </View>
      )}

      {title && (
        <View style={styles.titleWrap}>
          <Text style={[styles.centerTitle, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}

      <View style={styles.rightWrap}>
        {rightAction ? (
          rightAction
        ) : (
          <TouchableOpacity
            style={[styles.bellButton, { backgroundColor: isDark ? colors.cardElevated : colors.card }]}
            activeOpacity={0.7}
          >
            <PassCBTIcon name="bell" size={18} color={colors.text} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(18),
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(12),
  },
  userWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12),
    flex: 1,
  },
  avatar: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: moderateScale(15),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  greetingWrap: {
    flex: 1,
  },
  greetingLabel: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.medium,
  },
  nameText: {
    fontSize: moderateScale(17),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  backButton: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerTitle: {
    fontSize: moderateScale(17),
    fontFamily: PassCBTTheme.fonts.extraBold,
    textAlign: "center",
  },
  rightWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  bellButton: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: moderateScale(8),
    right: moderateScale(9),
    width: moderateScale(7),
    height: moderateScale(7),
    borderRadius: moderateScale(3.5),
    backgroundColor: "#5F33E1",
  },
});
