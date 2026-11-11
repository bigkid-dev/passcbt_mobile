import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useSettingsStore } from "../../store/useSettingsStore";
import { PassCBTTheme } from "../../constants/theme";

interface DateItem {
  date: Date;
  dayNumber: number;
  dayName: string;
  monthName: string;
  isToday: boolean;
  dateKey: string;
}

interface DateStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  daysRange?: number;
}

export function DateStrip({
  selectedDate,
  onSelectDate,
  daysRange = 14,
}: DateStripProps) {
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme !== "light";
  const colors = isDark ? PassCBTTheme.dark : PassCBTTheme.light;

  const dates: DateItem[] = useMemo(() => {
    const list: DateItem[] = [];
    const base = new Date();
    const start = new Date(base);
    start.setDate(base.getDate() - 2);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < daysRange; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);

      list.push({
        date: d,
        dayNumber: d.getDate(),
        dayName: dayNames[d.getDay()],
        monthName: monthNames[d.getMonth()],
        isToday: d.toDateString() === base.toDateString(),
        dateKey: d.toDateString(),
      });
    }

    return list;
  }, [daysRange]);

  const selectedKey = selectedDate.toDateString();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {dates.map((item) => {
        const isSelected = item.dateKey === selectedKey;

        return (
          <TouchableOpacity
            key={item.dateKey}
            style={[
              styles.card,
              {
                backgroundColor: isSelected ? "#5F33E1" : colors.card,
                borderColor: isSelected ? "#5F33E1" : colors.border,
              },
            ]}
            activeOpacity={0.75}
            onPress={() => onSelectDate(item.date)}
          >
            <Text
              style={[
                styles.monthText,
                { color: isSelected ? "rgba(255, 255, 255, 0.75)" : colors.textMuted },
              ]}
            >
              {item.monthName}
            </Text>

            <Text
              style={[
                styles.dayNumText,
                { color: isSelected ? "#FFFFFF" : colors.text },
              ]}
            >
              {item.dayNumber}
            </Text>

            <Text
              style={[
                styles.dayNameText,
                { color: isSelected ? "rgba(255, 255, 255, 0.75)" : colors.textMuted },
              ]}
            >
              {item.dayName}
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
    paddingBottom: moderateScale(8),
  },
  card: {
    width: moderateScale(56),
    height: moderateScale(88),
    borderRadius: moderateScale(18),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: moderateScale(10),
  },
  monthText: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.medium,
  },
  dayNumText: {
    fontSize: moderateScale(18),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  dayNameText: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.semiBold,
  },
});
