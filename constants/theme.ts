export const PassCBTTheme = {
  brand: {
    primary: "#5F33E1",
    primaryDark: "#4924C7",
    primaryLight: "#7D59F5",
    primarySubtle: "rgba(95, 51, 225, 0.12)",
    primarySurface: "#F0EDFC",
  },
  pastels: {
    blue: {
      bg: "#EBF5FF",
      bar: "#0066FF",
      iconBg: "#DBEAFE",
      text: "#0066FF",
    },
    peach: {
      bg: "#FFF0E6",
      bar: "#FF6633",
      iconBg: "#FFEDD5",
      text: "#FF6633",
    },
    pink: {
      bg: "#FFEBF2",
      bar: "#E91E63",
      iconBg: "#FCE7F3",
      text: "#E91E63",
    },
    mint: {
      bg: "#E8F8F0",
      bar: "#10B981",
      iconBg: "#D1FAE5",
      text: "#10B981",
    },
    lavender: {
      bg: "#F3E8FF",
      bar: "#8B5CF6",
      iconBg: "#EDE9FE",
      text: "#8B5CF6",
    },
    yellow: {
      bg: "#FEF7E6",
      bar: "#F59E0B",
      iconBg: "#FEF3C7",
      text: "#F59E0B",
    },
  },
  light: {
    background: "#F8F9FE",
    card: "#FFFFFF",
    cardElevated: "#F3F4F9",
    border: "#ECEEF5",
    borderFocus: "#5F33E1",
    text: "#1A1B2D",
    textMuted: "#787A91",
    textSubtle: "#A4A6B8",
    tabBar: "#FFFFFF",
    tabBarBorder: "rgba(0, 0, 0, 0.05)",
  },
  dark: {
    background: "#0E1017",
    card: "#151824",
    cardElevated: "#1D2132",
    border: "#24283B",
    borderFocus: "#7D59F5",
    text: "#F5F6FA",
    textMuted: "#8E92A8",
    textSubtle: "#5D6177",
    tabBar: "#131622",
    tabBarBorder: "rgba(255, 255, 255, 0.06)",
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 20,
    xl: 26,
    full: 999,
  },
  fonts: {
    regular: "LexendDeca_400Regular",
    medium: "LexendDeca_500Medium",
    semiBold: "LexendDeca_600SemiBold",
    bold: "LexendDeca_700Bold",
    extraBold: "LexendDeca_800ExtraBold",
  },
} as const;

export type ThemeColors = typeof PassCBTTheme.light;

export const Colors = {
  light: {
    text: PassCBTTheme.light.text,
    background: PassCBTTheme.light.background,
    tint: PassCBTTheme.brand.primary,
    icon: PassCBTTheme.light.textMuted,
    tabIconDefault: PassCBTTheme.light.textMuted,
    tabIconSelected: PassCBTTheme.brand.primary,
  },
  dark: {
    text: PassCBTTheme.dark.text,
    background: PassCBTTheme.dark.background,
    tint: PassCBTTheme.brand.primaryLight,
    icon: PassCBTTheme.dark.textMuted,
    tabIconDefault: PassCBTTheme.dark.textMuted,
    tabIconSelected: PassCBTTheme.brand.primaryLight,
  },
};

