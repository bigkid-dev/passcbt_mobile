import React from "react";
import { Tabs, useRouter } from "expo-router";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useSettingsStore } from "../../store/useSettingsStore";
import { PassCBTTheme } from "../../constants/theme";
import { PassCBTIcon } from "../../components/design/PassCBTSvgIcons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme !== "light";
  const colors = isDark ? PassCBTTheme.dark : PassCBTTheme.light;

  const currentRouteName = state.routes[state.index]?.name;

  const isTabActive = (name: string) => currentRouteName === name;

  const navigateTo = (name: string) => {
    navigation.navigate(name);
  };

  const activeColor = "#5F33E1";
  const inactiveColor = isDark ? "#6E728B" : "#8A8FA7";

  return (
    <View style={styles.floatingContainer} pointerEvents="box-none">
      <View
        style={[
          styles.tabBarPill,
          {
            backgroundColor: isDark ? "#171A27" : "#F3F0FD",
            borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(95, 51, 225, 0.1)",
          },
        ]}
      >
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.7}
          onPress={() => navigateTo("index")}
        >
          <View
            style={[
              styles.iconWrapper,
              isTabActive("index") && {
                backgroundColor: isDark ? "rgba(95, 51, 225, 0.2)" : "rgba(95, 51, 225, 0.12)",
              },
            ]}
          >
            <PassCBTIcon
              name="home"
              size={22}
              color={isTabActive("index") ? activeColor : inactiveColor}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.7}
          onPress={() => navigateTo("plan")}
        >
          <View
            style={[
              styles.iconWrapper,
              isTabActive("plan") && {
                backgroundColor: isDark ? "rgba(95, 51, 225, 0.2)" : "rgba(95, 51, 225, 0.12)",
              },
            ]}
          >
            <PassCBTIcon
              name="calendar"
              size={22}
              color={isTabActive("plan") ? activeColor : inactiveColor}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.centerFabAnchor} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.centerFab}
            activeOpacity={0.85}
            onPress={() => router.push("/tests/jamb")}
          >
            <PassCBTIcon name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.7}
          onPress={() => navigateTo("learning")}
        >
          <View
            style={[
              styles.iconWrapper,
              isTabActive("learning") && {
                backgroundColor: isDark ? "rgba(95, 51, 225, 0.2)" : "rgba(95, 51, 225, 0.12)",
              },
            ]}
          >
            <PassCBTIcon
              name="notes"
              size={22}
              color={isTabActive("learning") ? activeColor : inactiveColor}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.7}
          onPress={() => navigateTo("settings")}
        >
          <View
            style={[
              styles.iconWrapper,
              isTabActive("settings") && {
                backgroundColor: isDark ? "rgba(95, 51, 225, 0.2)" : "rgba(95, 51, 225, 0.12)",
              },
            ]}
          >
            <PassCBTIcon
              name="users"
              size={22}
              color={isTabActive("settings") ? activeColor : inactiveColor}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="plan" options={{ title: "Tasks" }} />
      <Tabs.Screen name="learning" options={{ title: "Notes" }} />
      <Tabs.Screen name="analytics" options={{ title: "Analytics" }} />
      <Tabs.Screen name="settings" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: moderateScale(16),
    paddingHorizontal: moderateScale(18),
    alignItems: "center",
  },
  tabBarPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: moderateScale(66),
    borderRadius: moderateScale(33),
    borderWidth: 1,
    paddingHorizontal: moderateScale(12),
    shadowColor: "#5F33E1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  iconWrapper: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    alignItems: "center",
    justifyContent: "center",
  },
  centerFabAnchor: {
    width: moderateScale(56),
    alignItems: "center",
    justifyContent: "center",
  },
  centerFab: {
    width: moderateScale(54),
    height: moderateScale(54),
    borderRadius: moderateScale(27),
    backgroundColor: "#5F33E1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: moderateScale(-26),
    shadowColor: "#5F33E1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
});
