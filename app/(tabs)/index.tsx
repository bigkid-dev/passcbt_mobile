import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { moderateScale } from "react-native-size-matters";
import { PassCBTIcon } from "../../components/design/PassCBTSvgIcons";
import { useStudentStore } from "../../store/useStudentStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useEnrolledSubjects } from "../../hooks/useTopics";
import { useOverallAnalytics } from "../../hooks/useAnalytics";
import { PassCBTTheme } from "../../constants/theme";
import { PassCBTHeader } from "../../components/design/PassCBTHeader";
import { HeroCard } from "../../components/design/HeroCard";
import { HorizontalSubjectCard } from "../../components/design/HorizontalSubjectCard";
import { GroupCard } from "../../components/design/GroupCard";

interface TestModeDef {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconBg: string;
  accentColor: string;
}

const EXAM_MODES: TestModeDef[] = [
  {
    id: "jamb",
    title: "JAMB UTME Test",
    subtitle: "40 min official past questions",
    icon: "target",
    iconBg: "rgba(95, 51, 225, 0.12)",
    accentColor: "#5F33E1",
  },
  {
    id: "waec",
    title: "WAEC SSCE Test",
    subtitle: "West African Senior Certificate",
    icon: "school",
    iconBg: "#E8F8F0",
    accentColor: "#10B981",
  },
  {
    id: "neco",
    title: "NECO SSCE Test",
    subtitle: "National Examinations Council",
    icon: "book",
    iconBg: "#FFF0E6",
    accentColor: "#FF6633",
  },
  {
    id: "speed",
    title: "Speed Test Round",
    subtitle: "Rapid-fire 10 min countdown",
    icon: "lightning",
    iconBg: "#FFEBF2",
    accentColor: "#E91E63",
  },
  {
    id: "prediction",
    title: "2026 AI-Predicted",
    subtitle: "Algorithmic high-yield forecasts",
    icon: "sparkles",
    iconBg: "rgba(95, 51, 225, 0.15)",
    accentColor: "#5F33E1",
  },
  {
    id: "knowledge",
    title: "Topic Knowledge Quiz",
    subtitle: "Targeted syllabus drills",
    icon: "bulb",
    iconBg: "#EBF5FF",
    accentColor: "#0066FF",
  },
  {
    id: "compete",
    title: "National Competition",
    subtitle: "Leaderboard ranked contest",
    icon: "trophy",
    iconBg: "#FEF7E6",
    accentColor: "#F59E0B",
  },
  {
    id: "post-utme",
    title: "Post-UTME Screening",
    subtitle: "University entrance aptitude",
    icon: "university",
    iconBg: "#FFEBF2",
    accentColor: "#F43F5E",
  },
  {
    id: "gce",
    title: "GCE O-Level Test",
    subtitle: "Private candidate past series",
    icon: "certificate",
    iconBg: "#F3E8FF",
    accentColor: "#8B5CF6",
  },
];

const PASTEL_VARIANTS: (keyof typeof PassCBTTheme.pastels)[] = [
  "blue",
  "peach",
  "mint",
  "pink",
  "lavender",
  "yellow",
];

export default function PracticeHomeScreen() {
  const router = useRouter();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme !== "light";
  const colors = isDark ? PassCBTTheme.dark : PassCBTTheme.light;

  const firstName = useStudentStore((s) => s.firstName);
  const targetExam = useStudentStore((s) => s.targetExam);
  const userId = useStudentStore((s) => s.userId) || "guest_student";

  const { data: enrolledSubjects = [] } = useEnrolledSubjects(userId);
  const { data: analytics } = useOverallAnalytics(userId);

  const heroProgress = useMemo(() => {
    if (analytics?.overall?.averageScore) {
      return analytics.overall.averageScore;
    }
    return 75;
  }, [analytics]);

  const targetExamSlug = useMemo(() => {
    return (targetExam || "jamb").toLowerCase().replace("_", "-");
  }, [targetExam]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <PassCBTHeader name={firstName || "Student"} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <HeroCard
          title="Your daily CBT goal is almost ready!"
          buttonText="Start Practice"
          percentage={heroProgress}
          onButtonPress={() => router.push(`/tests/${targetExamSlug}`)}
        />

        {enrolledSubjects.length > 0 ? (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>In Progress</Text>
              <View style={[styles.countBadge, { backgroundColor: PassCBTTheme.brand.primarySurface }]}>
                <Text style={styles.countText}>{enrolledSubjects.length}</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {enrolledSubjects.map((sub, idx) => {
                const variant = PASTEL_VARIANTS[idx % PASTEL_VARIANTS.length];
                const mockProgress = Math.min(95, Math.max(30, 45 + (idx * 15) % 50));

                return (
                  <HorizontalSubjectCard
                    key={sub.id}
                    category={`${targetExam} Prep`}
                    title={`${sub.name} Practice`}
                    icon="book"
                    progress={mockProgress}
                    variant={variant}
                    onPress={() => router.push(`/tests/knowledge?subject=${sub.code}`)}
                  />
                );
              })}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>In Progress</Text>
            </View>
            <TouchableOpacity
              style={[styles.emptyEnrollCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push("/onboarding")}
              activeOpacity={0.8}
            >
              <View style={[styles.emptyEnrollIconBox, { backgroundColor: PassCBTTheme.brand.primarySurface }]}>
                <PassCBTIcon name="add-circle" size={moderateScale(24)} color="#5F33E1" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.emptyEnrollTitle, { color: colors.text }]}>No Subjects Registered</Text>
                <Text style={[styles.emptyEnrollSubtitle, { color: colors.textMuted }]}>
                  Select your examination subjects to calibrate daily practice
                </Text>
              </View>
              <PassCBTIcon name="chevron-forward" size={moderateScale(18)} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Exam Modes</Text>
            <View style={[styles.countBadge, { backgroundColor: PassCBTTheme.brand.primarySurface }]}>
              <Text style={styles.countText}>{EXAM_MODES.length}</Text>
            </View>
          </View>

          <View style={styles.groupsContainer}>
            {EXAM_MODES.map((mode, idx) => {
              const mockProgress = Math.min(92, Math.max(25, 35 + (idx * 11) % 55));

              return (
                <GroupCard
                  key={mode.id}
                  title={mode.title}
                  subtitle={mode.subtitle}
                  icon={mode.icon}
                  iconBg={mode.iconBg}
                  accentColor={mode.accentColor}
                  progress={mockProgress}
                  onPress={() => router.push(`/tests/${mode.id}`)}
                />
              );
            })}
          </View>
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
    paddingBottom: moderateScale(90),
  },
  sectionContainer: {
    marginBottom: moderateScale(22),
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(18),
    marginBottom: moderateScale(14),
    gap: moderateScale(8),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  countBadge: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    color: "#5F33E1",
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  horizontalScroll: {
    paddingHorizontal: moderateScale(18),
  },
  emptyEnrollCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: moderateScale(18),
    padding: moderateScale(16),
    borderRadius: moderateScale(18),
    borderWidth: 1,
    gap: moderateScale(12),
  },
  emptyEnrollIconBox: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    alignItems: "center",
    justifyContent: "center",
  },
  emptyEnrollTitle: {
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.semiBold,
    marginBottom: moderateScale(2),
  },
  emptyEnrollSubtitle: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.regular,
    lineHeight: moderateScale(15),
  },
  groupsContainer: {
    paddingHorizontal: moderateScale(18),
  },
});
