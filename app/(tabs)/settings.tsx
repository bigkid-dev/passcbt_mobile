import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { moderateScale } from "react-native-size-matters";
import { PassCBTIcon } from "../../components/design/PassCBTSvgIcons";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useStudentStore } from "../../store/useStudentStore";
import { useUpdateAppSettingsMutation } from "../../hooks/useSettings";
import { seedDatabase } from "../../db/seed";
import { PassCBTTheme } from "../../constants/theme";
import { PassCBTHeader } from "../../components/design/PassCBTHeader";

const TARGET_EXAMS = ["JAMB", "WAEC", "NECO", "GCE", "Post-UTME"];

export default function SettingsScreen() {
  const router = useRouter();

  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme !== "light";
  const colors = isDark ? PassCBTTheme.dark : PassCBTTheme.light;
  const setTheme = useSettingsStore((s) => s.setTheme);
  const isSubscribed = useSettingsStore((s) => s.isSubscribed);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);
  const hapticEnabled = useSettingsStore((s) => s.hapticEnabled);
  const setHapticEnabled = useSettingsStore((s) => s.setHapticEnabled);

  const firstName = useStudentStore((s) => s.firstName);
  const lastName = useStudentStore((s) => s.lastName);
  const email = useStudentStore((s) => s.email);
  const targetExam = useStudentStore((s) => s.targetExam);
  const setSession = useStudentStore((s) => s.setSession);

  const updateSettingsMutation = useUpdateAppSettingsMutation();
  const [isReseeding, setIsReseeding] = useState<boolean>(false);

  const handleThemeChange = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
    updateSettingsMutation.mutate({ theme: newTheme });
  };

  const handleResetSeed = () => {
    Alert.alert(
      "Reset & Re-seed Database",
      "This will re-populate all default examination questions, syllabi, and subjects from the offline seed bundle.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Re-seed",
          style: "destructive",
          onPress: async () => {
            setIsReseeding(true);
            try {
              const res = await seedDatabase(true);
              Alert.alert(
                "Database Restored",
                `Successfully loaded ${res.questionsCount} exam questions into SQLite.`
              );
            } catch (err) {
              Alert.alert("Error", "Could not restore questions database.");
            } finally {
              setIsReseeding(false);
            }
          },
        },
      ]
    );
  };

  const initials = `${firstName ? firstName[0] : "S"}${lastName ? lastName[0] : "U"}`.toUpperCase();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <PassCBTHeader title="Settings" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>

          <View style={styles.profileDetails}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {firstName} {lastName}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textMuted }]}>
              {email || "Offline Student Profile"}
            </Text>
            <View style={styles.badgeRow}>
              <View style={[styles.targetBadge, { backgroundColor: PassCBTTheme.brand.primarySurface }]}>
                <PassCBTIcon name="school" size={moderateScale(12)} color="#5F33E1" />
                <Text style={styles.targetBadgeText}>{targetExam}</Text>
              </View>
              <View
                style={[
                  styles.planBadge,
                  {
                    backgroundColor: isSubscribed ? "#E8F8F0" : "#FFF0E6",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.planBadgeText,
                    { color: isSubscribed ? "#10B981" : "#FF6633" },
                  ]}
                >
                  {isSubscribed ? "PRO PASS" : "FREE PASS"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {!isSubscribed ? (
          <TouchableOpacity
            style={styles.proBanner}
            activeOpacity={0.88}
            onPress={() => router.push("/pricing")}
          >
            <View style={styles.proBannerLeft}>
              <View style={styles.proIconCircle}>
                <PassCBTIcon name="sparkles" size={moderateScale(20)} color="#F59E0B" />
              </View>
              <View style={styles.proBannerTextWrap}>
                <Text style={styles.proBannerTitle}>Upgrade to Pro Pass</Text>
                <Text style={styles.proBannerSubtitle}>
                  Unlock all 2026 AI predictions and explanations
                </Text>
              </View>
            </View>
            <View style={styles.proArrowPill}>
              <PassCBTIcon name="chevron-forward" size={moderateScale(16)} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.proActiveCard, { backgroundColor: colors.card, borderColor: "#10B981" }]}
            activeOpacity={0.88}
            onPress={() => router.push("/pricing")}
          >
            <View style={[styles.iconSquircle, { backgroundColor: "#E8F8F0" }]}>
              <PassCBTIcon name="shield-checkmark" size={moderateScale(20)} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.proActiveTitle, { color: colors.text }]}>Pro Pass Active</Text>
              <Text style={[styles.proActiveSubtitle, { color: colors.textMuted }]}>
                All features unlocked • Tap to manage
              </Text>
            </View>
            <PassCBTIcon name="chevron-forward" size={moderateScale(16)} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        <View style={styles.sectionWrap}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>EXAM TARGET</Text>
          <View style={[styles.cardGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.targetExamRow}>
              {TARGET_EXAMS.map((exam) => {
                const isSelected = targetExam === exam;
                return (
                  <TouchableOpacity
                    key={exam}
                    style={[
                      styles.targetChip,
                      {
                        backgroundColor: isSelected ? "#5F33E1" : isDark ? colors.cardElevated : colors.background,
                        borderColor: isSelected ? "#5F33E1" : colors.border,
                      },
                    ]}
                    onPress={() => setSession({ targetExam: exam })}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.targetChipText,
                        {
                          color: isSelected ? "#FFFFFF" : colors.text,
                          fontWeight: isSelected ? "700" : "500",
                        },
                      ]}
                    >
                      {exam}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.sectionWrap}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>APPEARANCE</Text>
          <View style={[styles.cardGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.settingItemRow}>
              <View style={styles.settingLabelWrap}>
                <View style={[styles.iconSquircle, { backgroundColor: "#F3E8FF" }]}>
                  <PassCBTIcon name="moon" size={moderateScale(18)} color="#8B5CF6" />
                </View>
                <View style={styles.settingTextWrap}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>Interface Theme</Text>
                  <Text style={[styles.settingHint, { color: colors.textMuted }]}>
                    Switch between dark and light scheme
                  </Text>
                </View>
              </View>
              <View style={[styles.themeSegment, { backgroundColor: isDark ? colors.cardElevated : colors.background }]}>
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    theme === "light" && { backgroundColor: "#5F33E1" },
                  ]}
                  onPress={() => handleThemeChange("light")}
                  activeOpacity={0.8}
                >
                  <PassCBTIcon
                    name="sunny"
                    size={moderateScale(14)}
                    color={theme === "light" ? "#FFFFFF" : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.segmentText,
                      { color: theme === "light" ? "#FFFFFF" : colors.textMuted },
                    ]}
                  >
                    Light
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    theme === "dark" && { backgroundColor: "#5F33E1" },
                  ]}
                  onPress={() => handleThemeChange("dark")}
                  activeOpacity={0.8}
                >
                  <PassCBTIcon
                    name="moon"
                    size={moderateScale(14)}
                    color={theme === "dark" ? "#FFFFFF" : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.segmentText,
                      { color: theme === "dark" ? "#FFFFFF" : colors.textMuted },
                    ]}
                  >
                    Dark
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionWrap}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>AUDIO & HAPTICS</Text>
          <View style={[styles.cardGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.settingItemRow, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <View style={styles.settingLabelWrap}>
                <View style={[styles.iconSquircle, { backgroundColor: "#E8F8F0" }]}>
                  <PassCBTIcon name="volume-high" size={moderateScale(18)} color="#10B981" />
                </View>
                <View style={styles.settingTextWrap}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>Sound Effects</Text>
                  <Text style={[styles.settingHint, { color: colors.textMuted }]}>
                    Play sound on exam timer & answers
                  </Text>
                </View>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: isDark ? "#24283B" : "#ECEEF5", true: "#5F33E1" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItemRow}>
              <View style={styles.settingLabelWrap}>
                <View style={[styles.iconSquircle, { backgroundColor: "#FFF0E6" }]}>
                  <PassCBTIcon name="phone-portrait" size={moderateScale(18)} color="#FF6633" />
                </View>
                <View style={styles.settingTextWrap}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>Haptic Feedback</Text>
                  <Text style={[styles.settingHint, { color: colors.textMuted }]}>
                    Vibrate on option clicks and timer
                  </Text>
                </View>
              </View>
              <Switch
                value={hapticEnabled}
                onValueChange={setHapticEnabled}
                trackColor={{ false: isDark ? "#24283B" : "#ECEEF5", true: "#5F33E1" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.sectionWrap}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>OFFLINE ENGINE & DATABASE</Text>
          <View style={[styles.cardGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.settingItemRow, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <View style={styles.settingLabelWrap}>
                <View style={[styles.iconSquircle, { backgroundColor: "#EBF5FF" }]}>
                  <PassCBTIcon name="server" size={moderateScale(18)} color="#0066FF" />
                </View>
                <View style={styles.settingTextWrap}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>Database Engine</Text>
                  <Text style={[styles.settingHint, { color: colors.textMuted }]}>
                    Expo SQLite with Drizzle ORM
                  </Text>
                </View>
              </View>
              <View style={styles.engineBadge}>
                <Text style={styles.engineBadgeText}>Active</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.settingItemRow}
              onPress={handleResetSeed}
              disabled={isReseeding}
              activeOpacity={0.7}
            >
              <View style={styles.settingLabelWrap}>
                <View style={[styles.iconSquircle, { backgroundColor: "#FFEBF2" }]}>
                  <PassCBTIcon name="refresh" size={moderateScale(18)} color="#E91E63" />
                </View>
                <View style={styles.settingTextWrap}>
                  <Text style={[styles.settingLabel, { color: "#E91E63" }]}>
                    Restore & Re-seed Questions
                  </Text>
                  <Text style={[styles.settingHint, { color: colors.textMuted }]}>
                    Re-import offline past questions & syllabi
                  </Text>
                </View>
              </View>
              {isReseeding ? (
                <ActivityIndicator size="small" color="#E91E63" />
              ) : (
                <PassCBTIcon name="chevron-forward" size={moderateScale(18)} color={colors.textMuted} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerWrap}>
          <Text style={[styles.versionText, { color: colors.text }]}>PassCBT • v1.0.0</Text>
          <Text style={[styles.copyrightText, { color: colors.textMuted }]}>
            Offline-first Nigerian exam preparation engine
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(90),
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(16),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    marginBottom: moderateScale(16),
    gap: moderateScale(14),
  },
  avatarWrap: {
    position: "relative",
  },
  avatarCircle: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: "#5F33E1",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: moderateScale(19),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: moderateScale(17),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  profileEmail: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.regular,
    marginTop: moderateScale(2),
  },
  badgeRow: {
    flexDirection: "row",
    gap: moderateScale(8),
    marginTop: moderateScale(8),
  },
  targetBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(8),
    gap: moderateScale(4),
  },
  targetBadgeText: {
    color: "#5F33E1",
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  planBadge: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(8),
  },
  planBadgeText: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  proBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#5F33E1",
    padding: moderateScale(16),
    borderRadius: moderateScale(20),
    marginBottom: moderateScale(20),
    shadowColor: "#5F33E1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  proBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12),
    flex: 1,
  },
  proIconCircle: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  proBannerTextWrap: {
    flex: 1,
  },
  proBannerTitle: {
    color: "#FFFFFF",
    fontSize: moderateScale(15),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  proBannerSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.medium,
    marginTop: moderateScale(2),
  },
  proArrowPill: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: moderateScale(8),
  },
  proActiveCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(14),
    borderRadius: moderateScale(18),
    borderWidth: 1.5,
    marginBottom: moderateScale(20),
    gap: moderateScale(12),
  },
  proActiveTitle: {
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  proActiveSubtitle: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.regular,
    marginTop: moderateScale(2),
  },
  sectionWrap: {
    marginBottom: moderateScale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.bold,
    letterSpacing: 0.6,
    marginBottom: moderateScale(8),
    paddingHorizontal: moderateScale(4),
  },
  cardGroup: {
    borderRadius: moderateScale(18),
    borderWidth: 1,
    overflow: "hidden",
  },
  targetExamRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: moderateScale(12),
    gap: moderateScale(8),
  },
  targetChip: {
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(12),
    borderWidth: 1,
  },
  targetChipText: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.medium,
  },
  settingItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: moderateScale(14),
  },
  settingLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12),
    flex: 1,
  },
  iconSquircle: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
  },
  settingTextWrap: {
    flex: 1,
  },
  settingLabel: {
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  settingHint: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.regular,
    marginTop: moderateScale(2),
  },
  themeSegment: {
    flexDirection: "row",
    borderRadius: moderateScale(12),
    padding: moderateScale(3),
    gap: moderateScale(3),
  },
  segmentButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(9),
    gap: moderateScale(4),
  },
  segmentText: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  engineBadge: {
    backgroundColor: "#E8F8F0",
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(8),
  },
  engineBadgeText: {
    color: "#10B981",
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  footerWrap: {
    alignItems: "center",
    paddingVertical: moderateScale(20),
  },
  versionText: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  copyrightText: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.regular,
    marginTop: moderateScale(3),
  },
});
