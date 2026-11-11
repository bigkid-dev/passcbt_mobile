import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { moderateScale } from "react-native-size-matters";
import { PassCBTIcon } from "../../components/design/PassCBTSvgIcons";
import { useExamWithQuestions, useSyncExamMutation } from "../../hooks/useExams";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useStudentStore } from "../../store/useStudentStore";
import { KaTeXView } from "../../components/KaTeXView";
import { PassCBTTheme } from "../../constants/theme";
import type { Question } from "../../types";

export default function TakeExamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme !== "light";
  const colors = isDark ? PassCBTTheme.dark : PassCBTTheme.light;
  const userId = useStudentStore((s) => s.userId) || "guest_student";

  const { data: examData, isLoading } = useExamWithQuestions(id);
  const syncExamMutation = useSyncExamMutation();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [gridVisible, setGridVisible] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const questions: Question[] = useMemo(() => examData?.questions || [], [examData]);

  useEffect(() => {
    if (examData && timeLeft === 0) {
      const initialSeconds = examData.timeLimit || 2400;
      setTimeLeft(initialSeconds);
      startTimeRef.current = Date.now();
    }
  }, [examData]);

  useEffect(() => {
    if (timeLeft <= 0 && examData && questions.length > 0) {
      handleSubmit(true);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examData, questions.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQuestion: Question | undefined = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleClearAnswer = () => {
    if (!currentQuestion) return;
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQuestion.id];
      return next;
    });
  };

  const calculateScore = () => {
    let correct = 0;
    for (const q of questions) {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    }
    return Math.round((correct / (questions.length || 1)) * 100);
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (submitting) return;

    if (!isAutoSubmit) {
      const answeredCount = Object.keys(answers).length;
      const totalCount = questions.length;
      const unanswered = totalCount - answeredCount;

      Alert.alert(
        "Submit Examination",
        unanswered > 0
          ? `You have ${unanswered} unanswered question${unanswered > 1 ? "s" : ""}. Are you sure you want to finish?`
          : "Are you ready to submit your exam answers?",
        [
          { text: "Continue Test", style: "cancel" },
          {
            text: "Submit Now",
            style: "default",
            onPress: () => performSubmission(),
          },
        ]
      );
      return;
    }

    performSubmission();
  };

  const performSubmission = async () => {
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const timeTaken = Math.max(0, Math.floor((Date.now() - startTimeRef.current) / 1000));
    const score = calculateScore();

    try {
      await syncExamMutation.mutateAsync({
        examId: id,
        score,
        answers,
        timeTaken,
        isCompleted: true,
        userId,
      });

      router.replace(`/solutions/${id}`);
    } catch (err) {
      console.error("Submit error:", err);
      Alert.alert("Submission Error", "Failed to save exam results.");
    } finally {
      setSubmitting(false);
    }
  };

  const isLowTime = timeLeft < 300;
  const answeredCount = Object.keys(answers).length;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5F33E1" />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Loading examination questions...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!examData || questions.length === 0 || !currentQuestion) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.emptyErrorContainer}>
          <PassCBTIcon name="alert-circle-outline" size={moderateScale(48)} color="#F43F5E" />
          <Text style={[styles.emptyErrorTitle, { color: colors.text }]}>No Questions Available</Text>
          <Text style={[styles.emptyErrorSubtitle, { color: colors.textMuted }]}>
            Unable to load questions for this examination session.
          </Text>
          <TouchableOpacity
            style={styles.emptyErrorButton}
            onPress={() => router.back()}
          >
            <PassCBTIcon name="arrow-back" size={moderateScale(16)} color="#FFFFFF" />
            <Text style={styles.emptyErrorButtonText}>Return to Setup</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const selectedAnswer = answers[currentQuestion.id];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Alert.alert(
              "Quit Examination",
              "Are you sure you want to exit? Your current progress will not be marked.",
              [
                { text: "Resume", style: "cancel" },
                { text: "Quit", style: "destructive", onPress: () => router.back() },
              ]
            );
          }}
        >
          <PassCBTIcon name="close" size={moderateScale(22)} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.matrixBadge, { backgroundColor: PassCBTTheme.brand.primarySurface }]}
          onPress={() => setGridVisible(true)}
        >
          <PassCBTIcon name="grid-outline" size={moderateScale(15)} color="#5F33E1" />
          <Text style={styles.matrixBadgeText}>
            {currentIndex + 1}/{questions.length}
          </Text>
        </TouchableOpacity>

        <View
          style={[
            styles.timerBadge,
            {
              backgroundColor: isLowTime ? "rgba(244, 63, 94, 0.15)" : PassCBTTheme.brand.primarySurface,
            },
          ]}
        >
          <PassCBTIcon
            name="timer-outline"
            size={moderateScale(15)}
            color={isLowTime ? "#F43F5E" : "#5F33E1"}
          />
          <Text
            style={[
              styles.timerText,
              { color: isLowTime ? "#F43F5E" : "#5F33E1" },
            ]}
          >
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.questionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.questionMetaRow}>
            <View style={[styles.qNumBadge, { backgroundColor: PassCBTTheme.brand.primarySurface }]}>
              <Text style={styles.qNumText}>Question {currentIndex + 1}</Text>
            </View>
            {currentQuestion.subjectName && (
              <Text style={[styles.subjectTag, { color: colors.textMuted }]}>
                {currentQuestion.subjectName}
              </Text>
            )}
          </View>

          <View style={styles.questionBody}>
            {currentQuestion.text.includes("$") || currentQuestion.text.includes("\\") ? (
              <KaTeXView content={currentQuestion.text} isDark={isDark} />
            ) : (
              <Text style={[styles.questionText, { color: colors.text }]}>
                {currentQuestion.text}
              </Text>
            )}
          </View>

          {selectedAnswer !== undefined && (
            <TouchableOpacity style={styles.clearBtn} onPress={handleClearAnswer}>
              <PassCBTIcon name="refresh-outline" size={moderateScale(13)} color="#F43F5E" />
              <Text style={styles.clearBtnText}>Clear Selected</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((optionText, optIndex) => {
            const isSelected = selectedAnswer === optIndex;
            const letters = ["A", "B", "C", "D", "E"];
            const letter = letters[optIndex] || `${optIndex + 1}`;

            return (
              <TouchableOpacity
                key={optIndex}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: isSelected ? "#5F33E1" : colors.card,
                    borderColor: isSelected ? "#5F33E1" : colors.border,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => handleSelectOption(optIndex)}
              >
                <View
                  style={[
                    styles.optBadge,
                    {
                      backgroundColor: isSelected
                        ? "rgba(255, 255, 255, 0.25)"
                        : PassCBTTheme.brand.primarySurface,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optBadgeText,
                      { color: isSelected ? "#FFFFFF" : "#5F33E1" },
                    ]}
                  >
                    {letter}
                  </Text>
                </View>

                <View style={styles.optContent}>
                  {optionText.includes("$") || optionText.includes("\\") ? (
                    <KaTeXView content={optionText} isDark={isSelected ? false : isDark} />
                  ) : (
                    <Text
                      style={[
                        styles.optText,
                        { color: isSelected ? "#FFFFFF" : colors.text },
                      ]}
                    >
                      {optionText}
                    </Text>
                  )}
                </View>

                {isSelected && (
                  <PassCBTIcon name="checkmark-circle" size={moderateScale(20)} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footerBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: colors.cardElevated, opacity: currentIndex === 0 ? 0.4 : 1 }]}
          disabled={currentIndex === 0}
          onPress={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
        >
          <PassCBTIcon name="arrow-back" size={moderateScale(18)} color={colors.text} />
          <Text style={[styles.navBtnText, { color: colors.text }]}>Prev</Text>
        </TouchableOpacity>

        {currentIndex < questions.length - 1 ? (
          <TouchableOpacity
            style={[styles.navBtnNext, { backgroundColor: "#5F33E1" }]}
            onPress={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
          >
            <Text style={styles.navBtnNextText}>Next</Text>
            <PassCBTIcon name="arrow-forward" size={moderateScale(18)} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navBtnNext, { backgroundColor: "#10B981" }]}
            onPress={() => handleSubmit(false)}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.navBtnNextText}>Finish</Text>
                <PassCBTIcon name="checkmark-circle" size={moderateScale(18)} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={gridVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Question Grid</Text>
              <TouchableOpacity onPress={() => setGridVisible(false)}>
                <PassCBTIcon name="close" size={moderateScale(22)} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.gridLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendBox, { backgroundColor: "#5F33E1" }]} />
                <Text style={[styles.legendText, { color: colors.textMuted }]}>
                  Answered ({answeredCount})
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendBox, { backgroundColor: colors.cardElevated }]} />
                <Text style={[styles.legendText, { color: colors.textMuted }]}>
                  Unanswered ({questions.length - answeredCount})
                </Text>
              </View>
            </View>

            <ScrollView contentContainerStyle={styles.gridScroll}>
              <View style={styles.gridWrapper}>
                {questions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isCurrent = idx === currentIndex;

                  return (
                    <TouchableOpacity
                      key={q.id}
                      style={[
                        styles.gridCell,
                        {
                          backgroundColor: isAnswered ? "#5F33E1" : colors.cardElevated,
                          borderColor: isCurrent ? (isAnswered ? "#FFFFFF" : "#5F33E1") : "transparent",
                          borderWidth: isCurrent ? 2 : 0,
                        },
                      ]}
                      onPress={() => {
                        setCurrentIndex(idx);
                        setGridVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.gridCellText,
                          { color: isAnswered ? "#FFFFFF" : colors.text },
                        ]}
                      >
                        {idx + 1}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.modalSubmitWrap}>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={() => {
                  setGridVisible(false);
                  handleSubmit(false);
                }}
              >
                <Text style={styles.modalSubmitText}>Submit Exam</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyErrorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: moderateScale(28),
  },
  emptyErrorTitle: {
    fontSize: moderateScale(18),
    fontFamily: PassCBTTheme.fonts.extraBold,
    marginTop: moderateScale(14),
    marginBottom: moderateScale(6),
  },
  emptyErrorSubtitle: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.regular,
    textAlign: "center",
    lineHeight: moderateScale(18),
    marginBottom: moderateScale(20),
  },
  emptyErrorButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5F33E1",
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(14),
    gap: moderateScale(8),
  },
  emptyErrorButtonText: {
    color: "#FFFFFF",
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  loadingText: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.medium,
    marginTop: moderateScale(10),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(18),
    paddingVertical: moderateScale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    padding: moderateScale(4),
  },
  matrixBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(12),
    gap: moderateScale(6),
  },
  matrixBadgeText: {
    color: "#5F33E1",
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(12),
    gap: moderateScale(6),
  },
  timerText: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  scroll: {
    padding: moderateScale(18),
    paddingBottom: moderateScale(100),
  },
  questionCard: {
    padding: moderateScale(18),
    borderRadius: moderateScale(22),
    borderWidth: 1,
    marginBottom: moderateScale(16),
  },
  questionMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(12),
  },
  qNumBadge: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(8),
  },
  qNumText: {
    color: "#5F33E1",
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  subjectTag: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.semiBold,
  },
  questionBody: {
    minHeight: moderateScale(60),
  },
  questionText: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(23),
    fontFamily: PassCBTTheme.fonts.semiBold,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: moderateScale(12),
    gap: moderateScale(4),
  },
  clearBtnText: {
    color: "#F43F5E",
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  optionsContainer: {
    gap: moderateScale(10),
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(15),
    borderRadius: moderateScale(18),
    borderWidth: 1,
  },
  optBadge: {
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(12),
  },
  optBadgeText: {
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  optContent: {
    flex: 1,
  },
  optText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    fontFamily: PassCBTTheme.fonts.medium,
  },
  footerBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(18),
    paddingVertical: moderateScale(12),
    borderTopWidth: 1,
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(18),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(14),
    gap: moderateScale(6),
  },
  navBtnText: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  navBtnNext: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(22),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(14),
    gap: moderateScale(6),
  },
  navBtnNextText: {
    color: "#FFFFFF",
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: moderateScale(26),
    borderTopRightRadius: moderateScale(26),
    padding: moderateScale(20),
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(14),
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  gridLegend: {
    flexDirection: "row",
    gap: moderateScale(16),
    marginBottom: moderateScale(16),
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
  },
  legendBox: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(4),
  },
  legendText: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.medium,
  },
  gridScroll: {
    paddingBottom: moderateScale(20),
  },
  gridWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(10),
    justifyContent: "flex-start",
  },
  gridCell: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(14),
    alignItems: "center",
    justifyContent: "center",
  },
  gridCellText: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  modalSubmitWrap: {
    marginTop: moderateScale(16),
  },
  modalSubmitBtn: {
    backgroundColor: "#5F33E1",
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(16),
    alignItems: "center",
    justifyContent: "center",
  },
  modalSubmitText: {
    color: "#FFFFFF",
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.bold,
  },
});
