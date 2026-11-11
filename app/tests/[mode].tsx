import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { moderateScale } from "react-native-size-matters";
import { useSubjects } from "../../hooks/useTopics";
import { useCreateExamMutation } from "../../hooks/useExams";
import { getRandomQuestionsForSession, getQuestions } from "../../repositories/questions.repository";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useStudentStore } from "../../store/useStudentStore";
import { syllabusList } from "../../lib/data";
import { PassCBTTheme } from "../../constants/theme";
import { PassCBTHeader } from "../../components/design/PassCBTHeader";
import { PassCBTButton } from "../../components/design/PassCBTButton";
import { PassCBTInput } from "../../components/design/PassCBTInput";
import { PassCBTIcon, PassCBTIconName } from "../../components/design/PassCBTSvgIcons";
import type { BoardType, ExamType } from "../../types";

interface ModeConfig {
  title: string;
  subtitle: string;
  board?: BoardType;
  examType: ExamType;
  defaultTimeLimit: number;
  defaultQuestions: number;
  badge: string;
  icon: PassCBTIconName;
}

const MODE_CONFIGS: Record<string, ModeConfig> = {
  jamb: {
    title: "JAMB UTME Practice",
    subtitle: "Official 40-question past examination paper",
    board: "JAMB",
    examType: "STANDARD",
    defaultTimeLimit: 2400,
    defaultQuestions: 40,
    badge: "Official",
    icon: "target",
  },
  waec: {
    title: "WAEC SSCE Practice",
    subtitle: "West African Senior Certificate past syllabus",
    board: "WAEC",
    examType: "STANDARD",
    defaultTimeLimit: 2700,
    defaultQuestions: 40,
    badge: "SSCE",
    icon: "school",
  },
  neco: {
    title: "NECO SSCE Practice",
    subtitle: "National Examinations Council standard papers",
    board: "NECO",
    examType: "STANDARD",
    defaultTimeLimit: 2700,
    defaultQuestions: 40,
    badge: "SSCE",
    icon: "book",
  },
  gce: {
    title: "GCE O-Level Practice",
    subtitle: "Private candidate examination revision pool",
    board: "GCE",
    examType: "STANDARD",
    defaultTimeLimit: 2700,
    defaultQuestions: 40,
    badge: "GCE",
    icon: "certificate",
  },
  "post-utme": {
    title: "Post-UTME Screening",
    subtitle: "University entrance preparatory test series",
    board: "POST_UTME",
    examType: "STANDARD",
    defaultTimeLimit: 1800,
    defaultQuestions: 40,
    badge: "Aptitude",
    icon: "university",
  },
  post_utme: {
    title: "Post-UTME Screening",
    subtitle: "University entrance preparatory test series",
    board: "POST_UTME",
    examType: "STANDARD",
    defaultTimeLimit: 1800,
    defaultQuestions: 40,
    badge: "Aptitude",
    icon: "university",
  },
  speed: {
    title: "Speed Test Round",
    subtitle: "Rapid-fire challenge against the clock",
    board: "JAMB",
    examType: "SPEED",
    defaultTimeLimit: 600,
    defaultQuestions: 20,
    badge: "Speed",
    icon: "lightning",
  },
  compete: {
    title: "National Competition",
    subtitle: "Timed contest ranked on the national leaderboard",
    board: "JAMB",
    examType: "STANDARD",
    defaultTimeLimit: 1800,
    defaultQuestions: 40,
    badge: "Ranked",
    icon: "trophy",
  },
  prediction: {
    title: "2026 AI-Predicted",
    subtitle: "High-probability test forecast questions",
    board: "JAMB",
    examType: "AI_PREDICTED",
    defaultTimeLimit: 2400,
    defaultQuestions: 40,
    badge: "AI 2026",
    icon: "sparkles",
  },
  knowledge: {
    title: "Topic Knowledge Quiz",
    subtitle: "Targeted syllabus drill to fix weak areas",
    examType: "KNOWLEDGE",
    defaultTimeLimit: 1200,
    defaultQuestions: 20,
    badge: "Drill",
    icon: "bulb",
  },
};

const QUESTION_COUNTS = [10, 20, 30, 40];
const TIME_OPTIONS = [
  { label: "10m", seconds: 600 },
  { label: "20m", seconds: 1200 },
  { label: "30m", seconds: 1800 },
  { label: "40m", seconds: 2400 },
  { label: "60m", seconds: 3600 },
];
const YEARS = ["All Years", "2024", "2023", "2022", "2021", "2020"];

export default function PracticeModeScreen() {
  const { mode = "jamb", subject: preselectedSubjectCode } = useLocalSearchParams<{
    mode: string;
    subject?: string;
  }>();
  const router = useRouter();

  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme !== "light";
  const colors = isDark ? PassCBTTheme.dark : PassCBTTheme.light;
  const userId = useStudentStore((s) => s.userId) || "guest_student";

  const normalizedMode = (mode || "jamb").toLowerCase().replace("_", "-");
  const config = MODE_CONFIGS[mode] || MODE_CONFIGS[normalizedMode] || MODE_CONFIGS.jamb;

  const { data: allSubjects = [] } = useSubjects();
  const createExamMutation = useCreateExamMutation();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedTopicTitle, setSelectedTopicTitle] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(config.defaultQuestions);
  const [timeLimit, setTimeLimit] = useState<number>(config.defaultTimeLimit);
  const [selectedYear, setSelectedYear] = useState<string>("All Years");
  const [isStarting, setIsStarting] = useState<boolean>(false);

  React.useEffect(() => {
    if (allSubjects.length > 0 && !selectedSubjectId) {
      if (preselectedSubjectCode) {
        const found = allSubjects.find(
          (s) => s.code.toLowerCase() === preselectedSubjectCode.toLowerCase()
        );
        if (found) {
          setSelectedSubjectId(found.id);
          return;
        }
      }
      setSelectedSubjectId(allSubjects[0].id);
    }
  }, [allSubjects, preselectedSubjectCode, selectedSubjectId]);

  const activeSubject = useMemo(() => {
    return allSubjects.find((s) => s.id === selectedSubjectId);
  }, [allSubjects, selectedSubjectId]);

  const syllabusTopics = useMemo(() => {
    if (!activeSubject) return [];
    const code = activeSubject.code.toUpperCase();
    const list = syllabusList[code];
    return list || [];
  }, [activeSubject]);

  const handleStartExam = async () => {
    if (!activeSubject) {
      Alert.alert("Select Subject", "Please pick a subject.");
      return;
    }

    setIsStarting(true);
    try {
      const yearFrom = selectedYear !== "All Years" ? Number(selectedYear) : undefined;
      const yearTo = selectedYear !== "All Years" ? Number(selectedYear) : undefined;

      const topicsSet =
        mode === "knowledge" && selectedTopicTitle ? new Set([selectedTopicTitle]) : undefined;

      let result = await getRandomQuestionsForSession({
        subjectNames: [activeSubject.name],
        board: config.board,
        yearFrom,
        yearTo,
        limit: questionCount,
        mode: config.examType,
        topics: topicsSet,
      });

      let chosenQuestions = result.questions;

      if (chosenQuestions.length === 0) {
        result = await getRandomQuestionsForSession({
          subjectNames: [activeSubject.name],
          limit: questionCount,
          mode: config.examType,
        });
        chosenQuestions = result.questions;
      }

      if (chosenQuestions.length === 0) {
        chosenQuestions = await getQuestions({ limit: questionCount });
      }

      if (chosenQuestions.length === 0) {
        Alert.alert("No Questions Found", "There are no questions for this subject yet.");
        setIsStarting(false);
        return;
      }

      const examTitle = `${activeSubject.name} - ${config.title}${
        selectedTopicTitle ? ` (${selectedTopicTitle})` : ""
      }`;

      const created = await createExamMutation.mutateAsync({
        title: examTitle,
        subjectId: activeSubject.id,
        userId,
        timeLimit,
        type: config.examType,
        totalQuestion: chosenQuestions.length,
        questions: chosenQuestions,
      });

      router.replace(`/take-exam/${created.id}`);
    } catch (err) {
      console.error("Start exam error:", err);
      Alert.alert("Error", "Could not create exam session.");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <PassCBTHeader title={config.title} showBack />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionWrap}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Selected Subject</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalChips}
          >
            {allSubjects.map((sub) => {
              const isSelected = sub.id === selectedSubjectId;
              return (
                <TouchableOpacity
                  key={sub.id}
                  style={[
                    styles.subjectChip,
                    {
                      backgroundColor: isSelected ? "#5F33E1" : colors.card,
                      borderColor: isSelected ? "#5F33E1" : colors.border,
                    },
                  ]}
                  onPress={() => {
                    setSelectedSubjectId(sub.id);
                    setSelectedTopicTitle("");
                  }}
                >
                  <PassCBTIcon
                    name="book"
                    size={14}
                    color={isSelected ? "#FFFFFF" : "#5F33E1"}
                    style={{ marginRight: moderateScale(6) }}
                  />
                  <Text
                    style={[
                      styles.chipText,
                      { color: isSelected ? "#FFFFFF" : colors.text, fontWeight: isSelected ? "700" : "500" },
                    ]}
                  >
                    {sub.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {mode === "knowledge" && syllabusTopics.length > 0 && (
          <View style={styles.sectionWrap}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Syllabus Topic Drill</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalChips}
            >
              <TouchableOpacity
                style={[
                  styles.topicChip,
                  {
                    backgroundColor: selectedTopicTitle === "" ? "#5F33E1" : colors.card,
                    borderColor: selectedTopicTitle === "" ? "#5F33E1" : colors.border,
                  },
                ]}
                onPress={() => setSelectedTopicTitle("")}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: selectedTopicTitle === "" ? "#FFFFFF" : colors.text },
                  ]}
                >
                  All Topics
                </Text>
              </TouchableOpacity>
              {syllabusTopics.map((topicItem, tIdx) => {
                const isSelected = selectedTopicTitle === topicItem.Topic;
                return (
                  <TouchableOpacity
                    key={tIdx}
                    style={[
                      styles.topicChip,
                      {
                        backgroundColor: isSelected ? "#5F33E1" : colors.card,
                        borderColor: isSelected ? "#5F33E1" : colors.border,
                      },
                    ]}
                    onPress={() => setSelectedTopicTitle(topicItem.Topic)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: isSelected ? "#FFFFFF" : colors.text, fontWeight: isSelected ? "700" : "500" },
                      ]}
                      numberOfLines={1}
                    >
                      {topicItem.Topic}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={styles.sectionWrap}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Question Quantity</Text>
          <View style={styles.segmentedRow}>
            {QUESTION_COUNTS.map((cnt) => {
              const isSelected = questionCount === cnt;
              return (
                <TouchableOpacity
                  key={cnt}
                  style={[
                    styles.segChip,
                    {
                      backgroundColor: isSelected ? "#5F33E1" : colors.card,
                      borderColor: isSelected ? "#5F33E1" : colors.border,
                    },
                  ]}
                  onPress={() => setQuestionCount(cnt)}
                >
                  <Text
                    style={[
                      styles.segText,
                      { color: isSelected ? "#FFFFFF" : colors.text, fontWeight: isSelected ? "700" : "600" },
                    ]}
                  >
                    {cnt} Qs
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionWrap}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Time Duration</Text>
          <View style={styles.segmentedRow}>
            {TIME_OPTIONS.map((timeOpt) => {
              const isSelected = timeLimit === timeOpt.seconds;
              return (
                <TouchableOpacity
                  key={timeOpt.seconds}
                  style={[
                    styles.segChip,
                    {
                      backgroundColor: isSelected ? "#5F33E1" : colors.card,
                      borderColor: isSelected ? "#5F33E1" : colors.border,
                    },
                  ]}
                  onPress={() => setTimeLimit(timeOpt.seconds)}
                >
                  <Text
                    style={[
                      styles.segText,
                      { color: isSelected ? "#FFFFFF" : colors.text, fontWeight: isSelected ? "700" : "600" },
                    ]}
                  >
                    {timeOpt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionWrap}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Past Question Year</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalChips}
          >
            {YEARS.map((yr) => {
              const isSelected = selectedYear === yr;
              return (
                <TouchableOpacity
                  key={yr}
                  style={[
                    styles.yearChip,
                    {
                      backgroundColor: isSelected ? "#5F33E1" : colors.card,
                      borderColor: isSelected ? "#5F33E1" : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedYear(yr)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: isSelected ? "#FFFFFF" : colors.text, fontWeight: isSelected ? "700" : "500" },
                    ]}
                  >
                    {yr}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <PassCBTButton
          title="Begin Test"
          showArrow
          loading={isStarting}
          onPress={handleStartExam}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    padding: moderateScale(18),
    paddingBottom: moderateScale(110),
  },
  sectionWrap: {
    marginBottom: moderateScale(20),
  },
  sectionLabel: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.bold,
    marginBottom: moderateScale(10),
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  horizontalChips: {
    gap: moderateScale(8),
    paddingVertical: moderateScale(2),
  },
  subjectChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(14),
    borderWidth: 1,
    gap: moderateScale(6),
  },
  topicChip: {
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    maxWidth: moderateScale(220),
  },
  yearChip: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(9),
    borderRadius: moderateScale(12),
    borderWidth: 1,
  },
  chipText: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.medium,
  },
  segmentedRow: {
    flexDirection: "row",
    gap: moderateScale(8),
  },
  segChip: {
    flex: 1,
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  segText: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.semiBold,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: moderateScale(18),
    borderTopWidth: 1,
  },
});
