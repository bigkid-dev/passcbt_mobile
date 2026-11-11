import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { moderateScale } from "react-native-size-matters";
import { PassCBTIcon } from "../components/design/PassCBTSvgIcons";
import { useToggleSubscriptionMutation } from "../hooks/useSettings";
import { useSettingsStore } from "../store/useSettingsStore";
import { useStudentStore } from "../store/useStudentStore";
import { PassCBTTheme } from "../constants/theme";
import { PassCBTButton } from "../components/design/PassCBTButton";

interface PlanOption {
  id: string;
  name: string;
  price: string;
  period: string;
  badge?: string;
  save?: string;
}

const PLANS: PlanOption[] = [
  {
    id: "monthly",
    name: "1 Month Access",
    price: "₦1,500",
    period: "per month",
  },
  {
    id: "quarterly",
    name: "3 Months Term",
    price: "₦3,500",
    period: "for 3 months",
    badge: "Most Popular",
    save: "Save 22%",
  },
  {
    id: "annual",
    name: "Full Academic Year",
    price: "₦7,500",
    period: "full access",
    badge: "Best Value",
    save: "Save 58%",
  },
];

const PRO_FEATURES = [
  {
    icon: "sparkles",
    title: "2026 AI-Predicted Questions",
    description: "Highest-probability questions forecast by exam trend algorithms.",
    bg: "#F3E8FF",
    color: "#8B5CF6",
  },
  {
    icon: "infinite",
    title: "Unlimited CBT Practice Tests",
    description: "Full simulations for JAMB, WAEC, NECO, GCE, and Post-UTME.",
    bg: "#EBF5FF",
    color: "#0066FF",
  },
  {
    icon: "calculator",
    title: "Step-by-Step Worked Solutions",
    description: "In-depth calculations with formulas, explanations, and shortcuts.",
    bg: "#FFF0E6",
    color: "#FF6633",
  },
  {
    icon: "book",
    title: "Complete Syllabus Study Notes",
    description: "High-yield summary notes and key definitions for registered subjects.",
    bg: "#E8F8F0",
    color: "#10B981",
  },
  {
    icon: "trophy",
    title: "National Leaderboard & XP",
    description: "Earn XP points and compete on the nationwide live student ladder.",
    bg: "#FEF7E6",
    color: "#F59E0B",
  },
  {
    icon: "cloud-offline",
    title: "100% Offline Access",
    description: "Study anywhere, anytime with no internet connection required.",
    bg: "#FFEBF2",
    color: "#E91E63",
  },
];

export default function PricingScreen() {
  const router = useRouter();

  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme !== "light";
  const colors = isDark ? PassCBTTheme.dark : PassCBTTheme.light;
  const isSubscribed = useSettingsStore((s) => s.isSubscribed);
  const setSubscribed = useSettingsStore((s) => s.setSubscribed);
  const userId = useStudentStore((s) => s.userId) || "guest_student";

  const toggleSubMutation = useToggleSubscriptionMutation();
  const [selectedPlanId, setSelectedPlanId] = useState<string>("quarterly");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleTogglePlan = async () => {
    setIsProcessing(true);
    try {
      const nextStatus = !isSubscribed;
      await toggleSubMutation.mutateAsync({
        isSubscribed: nextStatus,
        userId,
      });
      setSubscribed(nextStatus);

      if (nextStatus) {
        Alert.alert(
          "Pro Pass Activated!",
          "You now have complete, unrestricted access to all 9 test modes, AI predictions, and worked solutions offline.",
          [{ text: "Start Practicing", onPress: () => router.back() }]
        );
      } else {
        Alert.alert(
          "Plan Changed",
          "Your Pro Pass entitlement has been deactivated for testing purposes.",
          [{ text: "OK" }]
        );
      }
    } catch (err) {
      Alert.alert("Error", "Could not update entitlement. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: isDark ? colors.cardElevated : colors.card }]}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <PassCBTIcon name="close" size={moderateScale(20)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>PassCBT Pro</Text>
        <View style={{ width: moderateScale(36) }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroBanner}>
          <View style={styles.heroSparkleRow}>
            <View style={styles.heroBadge}>
              <PassCBTIcon name="sparkles" size={moderateScale(14)} color="#F59E0B" />
              <Text style={styles.heroBadgeText}>PREMIUM PASS</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Master Every Exam with Confidence</Text>
          <Text style={styles.heroSubtitle}>
            Full offline access to 2026 AI predictions, detailed solutions, and timed test engines.
          </Text>
        </View>

        {isSubscribed ? (
          <View style={[styles.activeStatusCard, { backgroundColor: colors.card, borderColor: "#10B981" }]}>
            <View style={[styles.activeIconCircle, { backgroundColor: "#E8F8F0" }]}>
              <PassCBTIcon name="checkmark-circle" size={moderateScale(26)} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.activeStatusTitle, { color: colors.text }]}>Pro Pass Active</Text>
              <Text style={[styles.activeStatusDesc, { color: colors.textMuted }]}>
                All 9 test modes and offline questions are fully unlocked on this device.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.plansContainer}>
            {PLANS.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: isSelected ? "#5F33E1" : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => setSelectedPlanId(plan.id)}
                >
                  {plan.badge && (
                    <View style={styles.planBadgeBanner}>
                      <Text style={styles.planBadgeBannerText}>{plan.badge}</Text>
                    </View>
                  )}

                  <View style={styles.planCardHeader}>
                    <View style={styles.radioWrap}>
                      <View
                        style={[
                          styles.radioCircle,
                          {
                            borderColor: isSelected ? "#5F33E1" : colors.border,
                            backgroundColor: isSelected ? "#5F33E1" : "transparent",
                          },
                        ]}
                      >
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <View>
                        <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
                        <Text style={[styles.planPeriod, { color: colors.textMuted }]}>{plan.period}</Text>
                      </View>
                    </View>

                    <View style={styles.priceWrap}>
                      <Text style={[styles.priceText, { color: isSelected ? "#5F33E1" : colors.text }]}>
                        {plan.price}
                      </Text>
                      {plan.save && (
                        <View style={styles.saveBadge}>
                          <Text style={styles.saveBadgeText}>{plan.save}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={[styles.featuresCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.featuresHeader, { color: colors.text }]}>Everything in Pro Pass</Text>

          {PRO_FEATURES.map((feat, idx) => (
            <View key={idx} style={styles.featureRow}>
              <View style={[styles.featIconBox, { backgroundColor: feat.bg }]}>
                <PassCBTIcon name={feat.icon} size={moderateScale(18)} color={feat.color} />
              </View>
              <View style={styles.featContent}>
                <Text style={[styles.featTitle, { color: colors.text }]}>{feat.title}</Text>
                <Text style={[styles.featDesc, { color: colors.textMuted }]}>{feat.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.guaranteeBox}>
          <PassCBTIcon name="shield-checkmark" size={moderateScale(16)} color="#10B981" />
          <Text style={[styles.guaranteeText, { color: colors.textMuted }]}>
            Local offline storage entitlement • Instant device unlock
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <PassCBTButton
          title={isSubscribed ? "Deactivate Pro Pass (Testing)" : "Unlock Pro Pass Now"}
          variant={isSubscribed ? "danger" : "primary"}
          showArrow={!isSubscribed}
          loading={isProcessing}
          onPress={handleTogglePlan}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(18),
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(12),
  },
  closeButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: moderateScale(17),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  scroll: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(110),
  },
  heroBanner: {
    backgroundColor: "#5F33E1",
    padding: moderateScale(22),
    borderRadius: moderateScale(22),
    marginBottom: moderateScale(20),
    shadowColor: "#5F33E1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  heroSparkleRow: {
    flexDirection: "row",
    marginBottom: moderateScale(12),
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
    gap: moderateScale(6),
  },
  heroBadgeText: {
    color: "#FFFFFF",
    fontSize: moderateScale(10),
    fontFamily: PassCBTTheme.fonts.extraBold,
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: moderateScale(22),
    fontFamily: PassCBTTheme.fonts.extraBold,
    lineHeight: moderateScale(28),
    marginBottom: moderateScale(8),
  },
  heroSubtitle: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.medium,
    lineHeight: moderateScale(18),
  },
  activeStatusCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(16),
    borderRadius: moderateScale(18),
    borderWidth: 1.5,
    gap: moderateScale(14),
    marginBottom: moderateScale(20),
  },
  activeIconCircle: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(23),
    alignItems: "center",
    justifyContent: "center",
  },
  activeStatusTitle: {
    fontSize: moderateScale(16),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  activeStatusDesc: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.regular,
    marginTop: moderateScale(3),
    lineHeight: moderateScale(16),
  },
  plansContainer: {
    gap: moderateScale(12),
    marginBottom: moderateScale(20),
  },
  planCard: {
    padding: moderateScale(16),
    borderRadius: moderateScale(18),
    position: "relative",
  },
  planBadgeBanner: {
    position: "absolute",
    top: moderateScale(-10),
    right: moderateScale(16),
    backgroundColor: "#5F33E1",
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(3),
    borderRadius: moderateScale(8),
  },
  planBadgeBannerText: {
    color: "#FFFFFF",
    fontSize: moderateScale(10),
    fontFamily: PassCBTTheme.fonts.extraBold,
    letterSpacing: 0.5,
  },
  planCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  radioWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12),
  },
  radioCircle: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: "#FFFFFF",
  },
  planName: {
    fontSize: moderateScale(15),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  planPeriod: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.regular,
    marginTop: moderateScale(2),
  },
  priceWrap: {
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: moderateScale(17),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  saveBadge: {
    backgroundColor: "#E8F8F0",
    paddingHorizontal: moderateScale(7),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(6),
    marginTop: moderateScale(3),
  },
  saveBadgeText: {
    color: "#10B981",
    fontSize: moderateScale(10),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  featuresCard: {
    padding: moderateScale(18),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    marginBottom: moderateScale(16),
  },
  featuresHeader: {
    fontSize: moderateScale(16),
    fontFamily: PassCBTTheme.fonts.extraBold,
    marginBottom: moderateScale(16),
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: moderateScale(14),
    gap: moderateScale(12),
  },
  featIconBox: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
    marginTop: moderateScale(2),
  },
  featContent: {
    flex: 1,
  },
  featTitle: {
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  featDesc: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.regular,
    lineHeight: moderateScale(16),
    marginTop: moderateScale(2),
  },
  guaranteeBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(6),
    paddingVertical: moderateScale(10),
  },
  guaranteeText: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.medium,
    textAlign: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: moderateScale(18),
    paddingTop: moderateScale(12),
    paddingBottom: moderateScale(20),
    borderTopWidth: 1,
  },
});
