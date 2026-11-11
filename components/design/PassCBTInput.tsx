import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useSettingsStore } from "../../store/useSettingsStore";
import { PassCBTTheme } from "../../constants/theme";
import { PassCBTIcon, PassCBTIconName } from "./PassCBTSvgIcons";

interface PassCBTInputProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  icon?: PassCBTIconName | string;
  rightIcon?: PassCBTIconName | string;
  onPress?: () => void;
  editable?: boolean;
}

export function PassCBTInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  icon,
  rightIcon,
  onPress,
  editable = true,
}: PassCBTInputProps) {
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme !== "light";
  const colors = isDark ? PassCBTTheme.dark : PassCBTTheme.light;

  const content = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.headerRow}>
        {icon && (
          <PassCBTIcon
            name={icon as PassCBTIconName}
            size={15}
            color="#5F33E1"
            style={{ marginRight: moderateScale(6) }}
          />
        )}
        <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
        {rightIcon && (
          <PassCBTIcon
            name={rightIcon as PassCBTIconName}
            size={15}
            color={colors.textMuted}
            style={{ marginLeft: "auto" }}
          />
        )}
      </View>

      {editable ? (
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              minHeight: multiline ? moderateScale(70) : undefined,
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSubtle}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
      ) : (
        <Text
          style={[
            styles.valueText,
            {
              color: value ? colors.text : colors.textSubtle,
            },
          ]}
        >
          {value || placeholder}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(18),
    borderWidth: 1,
    padding: moderateScale(14),
    marginBottom: moderateScale(14),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(6),
  },
  label: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.semiBold,
  },
  input: {
    fontSize: moderateScale(15),
    fontFamily: PassCBTTheme.fonts.bold,
    padding: 0,
  },
  valueText: {
    fontSize: moderateScale(15),
    fontFamily: PassCBTTheme.fonts.bold,
  },
});
