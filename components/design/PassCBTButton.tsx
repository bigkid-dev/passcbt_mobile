import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { PassCBTIcon } from "./PassCBTSvgIcons";
import { PassCBTTheme } from "../../constants/theme";

interface PassCBTButtonProps {
  title: string;
  onPress: () => void;
  showArrow?: boolean;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

export function PassCBTButton({
  title,
  onPress,
  showArrow = false,
  loading = false,
  disabled = false,
  variant = "primary",
}: PassCBTButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return "#A4A6B8";
    if (variant === "danger") return "#F43F5E";
    if (variant === "secondary") return "#EDE8FD";
    return "#5F33E1";
  };

  const getTextColor = () => {
    if (variant === "secondary") return "#5F33E1";
    return "#FFFFFF";
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
        },
      ]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          <Text style={[styles.title, { color: getTextColor() }]}>{title}</Text>
          {showArrow && (
            <PassCBTIcon
              name="pill-arrow"
              size={18}
              color={getTextColor()}
              style={styles.arrow}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateScale(16),
    paddingHorizontal: moderateScale(24),
    borderRadius: moderateScale(28),
    shadowColor: "#5F33E1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: moderateScale(15),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  arrow: {
    marginLeft: moderateScale(8),
  },
});
