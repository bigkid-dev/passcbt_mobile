import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { View, ActivityIndicator, StyleSheet, StatusBar } from "react-native";
import {
  useFonts,
  LexendDeca_400Regular,
  LexendDeca_500Medium,
  LexendDeca_600SemiBold,
  LexendDeca_700Bold,
  LexendDeca_800ExtraBold,
} from "@expo-google-fonts/lexend-deca";
import { initDatabase } from "../db/init";
import { useStudentStore } from "../store/useStudentStore";
import { useSettingsStore } from "../store/useSettingsStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
    },
  },
});

function RootNavigation() {
  const router = useRouter();
  const segments = useSegments();
  const hasOnboarded = useStudentStore((s) => s.hasOnboarded);
  const theme = useSettingsStore((s) => s.theme);
  const [dbReady, setDbReady] = useState(false);

  const [fontsLoaded] = useFonts({
    LexendDeca_400Regular,
    LexendDeca_500Medium,
    LexendDeca_600SemiBold,
    LexendDeca_700Bold,
    LexendDeca_800ExtraBold,
  });

  useEffect(() => {
    async function setup() {
      try {
        await initDatabase();
      } catch (err) {
        console.error("Init database error:", err);
      } finally {
        setDbReady(true);
      }
    }
    setup();
  }, []);

  useEffect(() => {
    if (!dbReady || !fontsLoaded) return;
    const inOnboarding = segments[0] === "onboarding";
    if (!hasOnboarded && !inOnboarding) {
      router.replace("/onboarding");
    }
  }, [dbReady, fontsLoaded, hasOnboarded, segments]);

  if (!dbReady || !fontsLoaded) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#5F33E1" />
      </View>
    );
  }

  const isDark = theme !== "light";

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: isDark ? "#0A0D14" : "#F9FAFB" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen
          name="take-exam/[id]"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="solutions/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="tests/[mode]" options={{ headerShown: false }} />
        <Stack.Screen name="learning/[topicId]" options={{ headerShown: false }} />
        <Stack.Screen name="pricing" options={{ headerShown: false, presentation: "modal" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigation />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: "#0A0D14",
    alignItems: "center",
    justifyContent: "center",
  },
});
