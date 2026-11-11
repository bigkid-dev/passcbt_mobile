import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { CircularProgress } from "./CircularProgress";
import { PassCBTIcon } from "./PassCBTSvgIcons";
import { PassCBTTheme } from "@/constants/theme";

interface HeroCardProps {
  title: string;
  buttonText: string;
  onButtonPress: () => void;
  percentage: number;
  onOptionsPress?: () => void;
}

export function HeroCard({
  title,
  buttonText,
  onButtonPress,
  percentage,
  onOptionsPress,
}: HeroCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.leftCol}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.8}
            onPress={onButtonPress}
          >
            <Text style={styles.ctaText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rightCol}>
          {onOptionsPress && (
            <TouchableOpacity
              style={styles.menuIconWrap}
              onPress={onOptionsPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <PassCBTIcon name="ellipsis-horizontal" size={moderateScale(16)} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          <View style={styles.progressWrap}>
            <CircularProgress
              percentage={percentage}
              size={moderateScale(72)}
              strokeWidth={moderateScale(6)}
              color="#FFFFFF"
              trackColor="rgba(255, 255, 255, 0.25)"
              textColor="#FFFFFF"
              fontSize={moderateScale(15)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#5F33E1",
    borderRadius: moderateScale(24),
    padding: moderateScale(20),
    marginHorizontal: moderateScale(18),
    marginBottom: moderateScale(20),
    shadowColor: "#5F33E1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftCol: {
    flex: 1,
    paddingRight: moderateScale(14),
  },
  title: {
    color: "#FFFFFF",
    fontFamily: PassCBTTheme.fonts.bold,
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    marginBottom: moderateScale(16),
  },
  ctaButton: {
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
    paddingHorizontal: moderateScale(18),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(14),
  },
  ctaText: {
    color: "#5F33E1",
    fontFamily: PassCBTTheme.fonts.semiBold,
    fontSize: moderateScale(13),
  },
  rightCol: {
    alignItems: "flex-end",
  },
  menuIconWrap: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateScale(8),
  },
  progressWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
});
