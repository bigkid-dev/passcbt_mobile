import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { PassCBTTheme } from "../../constants/theme";

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  textColor?: string;
  fontSize?: number;
}

export function CircularProgress({
  percentage,
  size = moderateScale(54),
  strokeWidth = moderateScale(4),
  color = "#5F33E1",
  trackColor = "rgba(255, 255, 255, 0.25)",
  textColor = "#FFFFFF",
  fontSize = moderateScale(13),
}: CircularProgressProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(percentage)));

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: trackColor,
          borderTopColor: color,
          borderRightColor: clamped > 25 ? color : trackColor,
          borderBottomColor: clamped > 50 ? color : trackColor,
          borderLeftColor: clamped > 75 ? color : trackColor,
        },
      ]}
    >
      <Text style={[styles.text, { color: textColor, fontSize }]}>{clamped}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: PassCBTTheme.fonts.bold,
  },
});
