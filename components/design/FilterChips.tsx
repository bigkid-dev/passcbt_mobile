import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useSettingsStore } from "../../store/useSettingsStore";
import { PassCBTTheme } from "../../constants/theme";

interface FilterChipsProps {
  items: string[];
  selected: string;
  onSelect: (item: string) => void;
}

export function FilterChips({ items, selected, onSelect }: FilterChipsProps) {
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme !== "light";

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {items.map((item) => {
        const isSelected = item.toLowerCase() === selected.toLowerCase();

        return (
          <TouchableOpacity
            key={item}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected
                  ? "#5F33E1"
                  : isDark
                  ? "#1F2232"
                  : PassCBTTheme.brand.primarySurface,
              },
            ]}
            activeOpacity={0.75}
            onPress={() => onSelect(item)}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: isSelected ? "#FFFFFF" : isDark ? "#A387FC" : "#5F33E1",
                  fontFamily: isSelected ? PassCBTTheme.fonts.bold : PassCBTTheme.fonts.semiBold,
                },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: moderateScale(18),
    gap: moderateScale(10),
    paddingVertical: moderateScale(12),
  },
  chip: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(14),
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: {
    fontSize: moderateScale(13),
  },
});
