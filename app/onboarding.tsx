import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { moderateScale } from "react-native-size-matters";
import { useSubjects, useEnrollSubjectMutation } from "../hooks/useTopics";
import { useCurrentUser, useUpdateUserProfileMutation } from "../hooks/useSettings";
import { useStudentStore } from "../store/useStudentStore";
import { useSettingsStore } from "../store/useSettingsStore";
import { PassCBTTheme } from "../constants/theme";
import { PassCBTButton } from "../components/design/PassCBTButton";
import { PassCBTInput } from "../components/design/PassCBTInput";
import { PassCBTIcon, PassCBTIconName } from "../components/design/PassCBTSvgIcons";
import type { BoardType } from "../types";

const BOARDS: { id: BoardType; label: string; desc: string; icon: PassCBTIconName }[] = [
  { id: "JAMB", label: "JAMB UTME", desc: "Unified Tertiary Matriculation Exam", icon: "target" },
  { id: "WAEC", label: "WAEC SSCE", desc: "West African Senior School Certificate", icon: "school" },
  { id: "NECO", label: "NECO SSCE", desc: "National Examinations Council", icon: "book" },
  { id: "GCE", label: "GCE O-Level", desc: "General Certificate of Education", icon: "certificate" },
  { id: "POST_UTME", label: "Post-UTME", desc: "University Screening Preparatory", icon: "university" },
];

function getSubjectIcon(code: string): PassCBTIconName {
  const c = code.toUpperCase();
  if (c === "ENG" || c === "LIT" || c === "CRS" || c === "IRS") return "book";
  if (c === "MATH" || c === "CHE") return "target";
  if (c === "PHY") return "lightning";
  if (c === "BIO") return "sparkles";
  if (c === "COM" || c === "ECO" || c === "ACCT") return "briefcase";
  if (c === "GOV") return "university";
  if (c === "GEO" || c === "AGRIC") return "school";
  return "book";
}

export default function OnboardingScreen() {
  const router = useRouter();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme !== "light";
  const colors = isDark ? PassCBTTheme.dark : PassCBTTheme.light;

  const { data: user } = useCurrentUser();
  const { data: allSubjects = [] } = useSubjects();
  const enrollMutation = useEnrollSubjectMutation();
  const updateProfileMutation = useUpdateUserProfileMutation();

  const setSession = useStudentStore((s) => s.setSession);
  const setOnboarded = useStudentStore((s) => s.setOnboarded);
  const isSubscribed = useSettingsStore((s) => s.isSubscribed);

  const [step, setStep] = useState<number>(1);
  const [firstName, setFirstName] = useState<string>("Student");
  const [targetExam, setTargetExam] = useState<BoardType>("JAMB");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const maxSubjects = isSubscribed ? 9 : 4;

  const englishSubject = useMemo(
    () => allSubjects.find((s) => s.code === "ENG" || s.name.toLowerCase().includes("english")),
    [allSubjects]
  );

  React.useEffect(() => {
    if (englishSubject && selectedSubjectIds.length === 0) {
      setSelectedSubjectIds([englishSubject.id]);
    }
  }, [englishSubject, selectedSubjectIds.length]);

  const toggleSubject = (subjectId: string) => {
    if (englishSubject && subjectId === englishSubject.id) {
      Alert.alert("Required Subject", "English Language is compulsory for examination registration.");
      return;
    }

    if (selectedSubjectIds.includes(subjectId)) {
      setSelectedSubjectIds((prev) => prev.filter((id) => id !== subjectId));
    } else {
      if (selectedSubjectIds.length >= maxSubjects) {
        Alert.alert(
          "Subject Limit",
          `Free tier supports up to ${maxSubjects} subjects. Upgrade to Pro Pass for unlimited subjects.`
        );
        return;
      }
      setSelectedSubjectIds((prev) => [...prev, subjectId]);
    }
  };

  const handleStep2Next = () => {
    if (!firstName.trim()) {
      Alert.alert("Name Required", "Please enter your first name to personalize your study plan.");
      return;
    }
    setStep(3);
  };

  const handleFinish = async () => {
    if (selectedSubjectIds.length < 3) {
      Alert.alert("Subject Selection", "Please select at least 3 subjects to continue.");
      return;
    }

    setIsSubmitting(true);
    const userId = user?.id || "guest_student";

    for (const subId of selectedSubjectIds) {
      try {
        await enrollMutation.mutateAsync({ userId, subjectId: subId });
      } catch (err) {
        console.error("Enrollment error:", err);
      }
    }

    try {
      await updateProfileMutation.mutateAsync({
        userId,
        data: {
          firstName: firstName.trim() || "Student",
          hasOnboarded: true,
        },
      });
    } catch (err) {
      console.error("Update profile error:", err);
    }

    setSession({
      userId,
      firstName: firstName.trim() || "Student",
      targetExam,
      enrolledSubjectIds: selectedSubjectIds,
      hasOnboarded: true,
    });
    setOnboarded(true);

    router.replace("/(tabs)");
  };

  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return allSubjects;
    const q = searchQuery.toLowerCase();
    return allSubjects.filter(
      (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
    );
  }, [allSubjects, searchQuery]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {step === 1 && (
        <View style={styles.welcomeContainer}>
          <View style={styles.heroIllustrationWrapper}>
            <Image
              source={require("../assets/images/onboarding-illustration.png")}
              style={styles.heroIllustration}
              resizeMode="contain"
            />
          </View>

          <View style={styles.welcomeContent}>
            <Text style={[styles.welcomeHeadline, { color: colors.text }]}>
              Master CBT Exams{"\n"}& Daily Practice
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.textMuted }]}>
              This productive tool is designed to help you better manage your syllabus topics and practice past questions conveniently!
            </Text>
          </View>

          <View style={styles.welcomeButtonWrap}>
            <PassCBTButton
              title="Let's Start"
              showArrow
              onPress={() => setStep(2)}
            />
          </View>
        </View>
      )}

      {step === 2 && (
        <ScrollView contentContainerStyle={styles.stepScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.navTopRow}>
            <TouchableOpacity
              style={[
                styles.backIconBtn,
                {
                  backgroundColor: isDark ? colors.cardElevated : colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setStep(1)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <PassCBTIcon name="arrow-left" size={18} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.stepIndicatorPill}>
              <Text style={styles.stepIndicatorText}>Step 2 of 3</Text>
            </View>
            <View style={{ width: moderateScale(40) }} />
          </View>

          <View style={styles.stepHeader}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Student Profile</Text>
            <Text style={[styles.stepDesc, { color: colors.textMuted }]}>
              Personalize your study experience and target examination board
            </Text>
          </View>

          <PassCBTInput
            label="Your First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="e.g. Livia"
            icon="user"
          />

          <Text style={[styles.fieldLabel, { color: colors.text }]}>Select Target Examination</Text>
          <View style={styles.boardsContainer}>
            {BOARDS.map((b) => {
              const isSelected = targetExam === b.id;
              return (
                <TouchableOpacity
                  key={b.id}
                  style={[
                    styles.boardCard,
                    {
                      backgroundColor: isSelected ? "#5F33E1" : colors.card,
                      borderColor: isSelected ? "#5F33E1" : colors.border,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setTargetExam(b.id)}
                >
                  <View
                    style={[
                      styles.boardIconBox,
                      {
                        backgroundColor: isSelected
                          ? "rgba(255, 255, 255, 0.2)"
                          : isDark
                          ? "#1D2132"
                          : PassCBTTheme.brand.primarySurface,
                      },
                    ]}
                  >
                    <PassCBTIcon
                      name={b.icon}
                      size={20}
                      color={isSelected ? "#FFFFFF" : "#5F33E1"}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.boardLabel,
                        { color: isSelected ? "#FFFFFF" : colors.text },
                      ]}
                    >
                      {b.label}
                    </Text>
                    <Text
                      style={[
                        styles.boardDesc,
                        {
                          color: isSelected
                            ? "rgba(255, 255, 255, 0.75)"
                            : colors.textMuted,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {b.desc}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.selectionIndicator,
                      {
                        backgroundColor: isSelected ? "#FFFFFF" : "transparent",
                        borderColor: isSelected ? "#FFFFFF" : colors.border,
                      },
                    ]}
                  >
                    {isSelected && (
                      <PassCBTIcon name="check" size={13} color="#5F33E1" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ marginTop: moderateScale(24) }}>
            <PassCBTButton
              title="Next: Select Subjects"
              showArrow
              onPress={handleStep2Next}
            />
          </View>
        </ScrollView>
      )}

      {step === 3 && (
        <View style={styles.subjectsStepContainer}>
          <View style={styles.navTopRow}>
            <TouchableOpacity
              style={[
                styles.backIconBtn,
                {
                  backgroundColor: isDark ? colors.cardElevated : colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setStep(2)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <PassCBTIcon name="arrow-left" size={18} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.stepIndicatorPill}>
              <Text style={styles.stepIndicatorText}>Step 3 of 3</Text>
            </View>
            <View style={{ width: moderateScale(40) }} />
          </View>

          <View style={styles.stepHeader}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Choose Subjects</Text>
            <Text style={[styles.stepDesc, { color: colors.textMuted }]}>
              Selected {selectedSubjectIds.length} of {maxSubjects} subjects (English is compulsory)
            </Text>
          </View>

          <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <PassCBTIcon name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search subjects..."
              placeholderTextColor={colors.textSubtle}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <PassCBTIcon name="close" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>

          {filteredSubjects.length === 0 ? (
            <View style={styles.emptySearchWrap}>
              <PassCBTIcon name="book" size={38} color={colors.textMuted} />
              <Text style={[styles.emptySearchTitle, { color: colors.text }]}>No Subjects Found</Text>
              <Text style={[styles.emptySearchSubtitle, { color: colors.textMuted }]}>
                No subjects match &ldquo;{searchQuery}&rdquo;
              </Text>
              <TouchableOpacity
                style={styles.clearSearchBtn}
                onPress={() => setSearchQuery("")}
              >
                <Text style={styles.clearSearchBtnText}>Clear Search</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.subjectsGrid} showsVerticalScrollIndicator={false}>
              {filteredSubjects.map((sub) => {
                const isSelected = selectedSubjectIds.includes(sub.id);
                const isRequired = englishSubject && sub.id === englishSubject.id;

                return (
                  <TouchableOpacity
                    key={sub.id}
                    style={[
                      styles.subjectCard,
                      {
                        backgroundColor: isSelected ? "#5F33E1" : colors.card,
                        borderColor: isSelected ? "#5F33E1" : colors.border,
                      },
                    ]}
                    activeOpacity={0.75}
                    onPress={() => toggleSubject(sub.id)}
                  >
                    <View style={styles.subjectTopRow}>
                      <View
                        style={[
                          styles.subjectIconBox,
                          {
                            backgroundColor: isSelected
                              ? "rgba(255, 255, 255, 0.2)"
                              : PassCBTTheme.brand.primarySurface,
                          },
                        ]}
                      >
                        <PassCBTIcon
                          name={getSubjectIcon(sub.code)}
                          size={16}
                          color={isSelected ? "#FFFFFF" : "#5F33E1"}
                        />
                      </View>
                      {isRequired ? (
                        <View
                          style={[
                            styles.reqBadge,
                            {
                              backgroundColor: isSelected
                                ? "rgba(255, 255, 255, 0.25)"
                                : PassCBTTheme.brand.primarySurface,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.reqText,
                              { color: isSelected ? "#FFFFFF" : "#5F33E1" },
                            ]}
                          >
                            REQ
                          </Text>
                        </View>
                      ) : isSelected ? (
                        <View style={styles.selectedCheckBadge}>
                          <PassCBTIcon name="check" size={11} color="#5F33E1" />
                        </View>
                      ) : (
                        <PassCBTIcon name="plus" size={14} color={colors.textSubtle} />
                      )}
                    </View>

                    <Text
                      style={[
                        styles.subjectName,
                        { color: isSelected ? "#FFFFFF" : colors.text },
                      ]}
                      numberOfLines={1}
                    >
                      {sub.name}
                    </Text>
                    <Text
                      style={[
                        styles.subjectCode,
                        { color: isSelected ? "rgba(255, 255, 255, 0.75)" : colors.textMuted },
                      ]}
                    >
                      {sub.code}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          <View style={[styles.footerBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <PassCBTButton
              title="Start Practicing"
              showArrow
              loading={isSubmitting}
              onPress={handleFinish}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(16),
  },
  heroIllustrationWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    maxHeight: moderateScale(380),
    width: "100%",
  },
  heroIllustration: {
    width: "100%",
    height: "100%",
  },
  welcomeContent: {
    alignItems: "center",
    paddingHorizontal: moderateScale(16),
    marginVertical: moderateScale(16),
  },
  welcomeHeadline: {
    fontSize: moderateScale(28),
    fontFamily: PassCBTTheme.fonts.extraBold,
    textAlign: "center",
    lineHeight: moderateScale(36),
    marginBottom: moderateScale(12),
  },
  welcomeSubtitle: {
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.regular,
    textAlign: "center",
    lineHeight: moderateScale(22),
    paddingHorizontal: moderateScale(8),
  },
  welcomeButtonWrap: {
    paddingHorizontal: moderateScale(8),
    paddingBottom: moderateScale(12),
  },
  stepScroll: {
    padding: moderateScale(20),
    paddingBottom: moderateScale(40),
  },
  navTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(16),
  },
  backIconBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  stepIndicatorPill: {
    backgroundColor: PassCBTTheme.brand.primarySurface,
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(16),
  },
  stepIndicatorText: {
    color: "#5F33E1",
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  stepHeader: {
    marginBottom: moderateScale(20),
  },
  stepTitle: {
    fontSize: moderateScale(24),
    fontFamily: PassCBTTheme.fonts.extraBold,
    marginBottom: moderateScale(4),
  },
  stepDesc: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.regular,
    lineHeight: moderateScale(18),
  },
  fieldLabel: {
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.bold,
    marginBottom: moderateScale(12),
    marginTop: moderateScale(8),
  },
  boardsContainer: {
    gap: moderateScale(10),
  },
  boardCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(14),
    borderRadius: moderateScale(18),
    borderWidth: 1,
    gap: moderateScale(12),
  },
  boardIconBox: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(14),
    alignItems: "center",
    justifyContent: "center",
  },
  boardLabel: {
    fontSize: moderateScale(15),
    fontFamily: PassCBTTheme.fonts.bold,
    marginBottom: moderateScale(2),
  },
  boardDesc: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.regular,
  },
  selectionIndicator: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  subjectsStepContainer: {
    flex: 1,
    padding: moderateScale(18),
    paddingBottom: 0,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(14),
    borderWidth: 1,
    gap: moderateScale(8),
    marginBottom: moderateScale(14),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.medium,
    padding: 0,
  },
  emptySearchWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateScale(40),
  },
  emptySearchTitle: {
    fontSize: moderateScale(16),
    fontFamily: PassCBTTheme.fonts.bold,
    marginTop: moderateScale(10),
    marginBottom: moderateScale(4),
  },
  emptySearchSubtitle: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.regular,
    marginBottom: moderateScale(14),
  },
  clearSearchBtn: {
    backgroundColor: PassCBTTheme.brand.primarySurface,
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(10),
  },
  clearSearchBtnText: {
    color: "#5F33E1",
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  subjectsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(10),
    paddingBottom: moderateScale(110),
  },
  subjectCard: {
    width: "48%",
    padding: moderateScale(14),
    borderRadius: moderateScale(16),
    borderWidth: 1,
  },
  subjectTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(10),
  },
  subjectIconBox: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCheckBadge: {
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(9),
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  reqBadge: {
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(6),
  },
  reqText: {
    fontSize: moderateScale(9),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  subjectName: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.bold,
    marginBottom: moderateScale(2),
  },
  subjectCode: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.semiBold,
  },
  footerBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: moderateScale(16),
    borderTopWidth: 1,
  },
});
