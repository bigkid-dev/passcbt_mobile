import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { moderateScale } from "react-native-size-matters";
import { PassCBTIcon } from "../../components/design/PassCBTSvgIcons";
import { useExamWithQuestions } from "../../hooks/useExams";
import { useSettingsStore } from "../../store/useSettingsStore";
import { KaTeXView } from "../../components/KaTeXView";
import { PassCBTTheme } from "../../constants/theme";
import { PassCBTHeader } from "../../components/design/PassCBTHeader";
import { CircularProgress } from "../../components/design/CircularProgress";
import { FilterChips } from "../../components/design/FilterChips";
import { PassCBTButton } from "../../components/design/PassCBTButton";
import type { Question } from "../../types";

const FILTER_ITEMS = ["All", "Correct", "Incorrect", "Unanswered"];

export default function SolutionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme !== "light";
  const colors = isDark ? PassCBTTheme.dark : PassCBTTheme.light;

  const { data: examData, isLoading } = useExamWithQuestions(id);
  const [filter, setFilter] = useState<string>("All");

  const answers: Record<string, number> = useMemo(() => {
    return (examData?.answerPicked as Record<string, number>) || {};
  }, [examData]);

  const questions: Question[] = useMemo(() => examData?.questions || [], [examData]);

  const stats = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    for (const q of questions) {
      const picked = answers[q.id];
      if (picked === undefined) {
        unanswered++;
      } else if (picked === q.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    }

    const total = questions.length || 1;
    const percentage = Math.round((correct / total) * 100);

    return { correct, incorrect, unanswered, percentage, total: questions.length };
  }, [questions, answers]);

  const filteredQuestions = useMemo(() => {
    if (filter === "Correct") {
      return questions.filter((q) => answers[q.id] === q.correctAnswer);
    }
    if (filter === "Incorrect") {
      return questions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== q.correctAnswer);
    }
    if (filter === "Unanswered") {
      return questions.filter((q) => answers[q.id] === undefined);
    }
    return questions;
  }, [questions, answers, filter]);

  if (isLoading || !examData) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5F33E1" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <PassCBTHeader
        title="Exam Results"
        showBack
        onBack={() => router.replace("/(tabs)")}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroScoreCard}>
          <View style={styles.heroScoreLeft}>
            <Text style={styles.scoreTitle}>Examination Complete</Text>
            <Text style={styles.scoreSub}>
              {stats.correct} out of {stats.total} questions answered correctly
            </Text>
            <View style={styles.scorePillsRow}>
              <View style={[styles.statPill, { backgroundColor: "rgba(16, 185, 129, 0.2)" }]}>
                <PassCBTIcon name="checkmark-circle" size={moderateScale(12)} color="#10B981" />
                <Text style={[styles.statPillText, { color: "#10B981" }]}>{stats.correct} Correct</Text>
              </View>
              <View style={[styles.statPill, { backgroundColor: "rgba(244, 63, 94, 0.2)" }]}>
                <PassCBTIcon name="close-circle" size={moderateScale(12)} color="#F43F5E" />
                <Text style={[styles.statPillText, { color: "#F43F5E" }]}>{stats.incorrect} Wrong</Text>
              </View>
            </View>
          </View>

          <View style={styles.heroScoreRight}>
            <CircularProgress
              percentage={stats.percentage}
              size={moderateScale(76)}
              strokeWidth={moderateScale(6)}
              color="#10B981"
              trackColor="rgba(255, 255, 255, 0.2)"
              textColor="#FFFFFF"
              fontSize={moderateScale(15)}
            />
          </View>
        </View>

        <FilterChips
          items={FILTER_ITEMS}
          selected={filter}
          onSelect={setFilter}
        />

        {filteredQuestions.length === 0 ? (
          <View style={[styles.emptyFilterWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <PassCBTIcon name="sparkles" size={moderateScale(36)} color="#10B981" />
            <Text style={[styles.emptyFilterTitle, { color: colors.text }]}>No Questions in this Filter</Text>
            <Text style={[styles.emptyFilterSub, { color: colors.textMuted }]}>
              {filter === "Incorrect"
                ? "Excellent performance! You did not have any wrong answers in this category."
                : filter === "Unanswered"
                ? "You attempted every question in this test!"
                : "No questions match your selected filter."}
            </Text>
            <TouchableOpacity
              style={styles.resetFilterBtn}
              onPress={() => setFilter("All")}
            >
              <Text style={styles.resetFilterBtnText}>Show All Questions</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.questionsList}>
            {filteredQuestions.map((q, idx) => {
              const pickedIndex = answers[q.id];
              const isCorrect = pickedIndex === q.correctAnswer;
              const isUnanswered = pickedIndex === undefined;
              const letters = ["A", "B", "C", "D", "E"];

              return (
                <View
                  key={q.id}
                  style={[
                    styles.solutionCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: isCorrect
                        ? "rgba(16, 185, 129, 0.4)"
                        : isUnanswered
                        ? colors.border
                        : "rgba(244, 63, 94, 0.4)",
                    },
                  ]}
                >
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.qNumBox}>
                      <Text style={styles.qNumText}>Q{idx + 1}</Text>
                    </View>

                    <View
                      style={[
                        styles.outcomeBadge,
                        {
                          backgroundColor: isCorrect
                            ? "rgba(16, 185, 129, 0.15)"
                            : isUnanswered
                            ? colors.cardElevated
                            : "rgba(244, 63, 94, 0.15)",
                        },
                      ]}
                    >
                      <PassCBTIcon
                        name={
                          isCorrect
                            ? "checkmark-circle"
                            : isUnanswered
                            ? "help-circle-outline"
                            : "close-circle"
                        }
                        size={moderateScale(13)}
                        color={isCorrect ? "#10B981" : isUnanswered ? colors.textMuted : "#F43F5E"}
                      />
                      <Text
                        style={[
                          styles.outcomeText,
                          {
                            color: isCorrect
                              ? "#10B981"
                              : isUnanswered
                              ? colors.textMuted
                              : "#F43F5E",
                          },
                        ]}
                      >
                        {isCorrect ? "Correct" : isUnanswered ? "Skipped" : "Incorrect"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.questionTextWrap}>
                    {q.text.includes("$") || q.text.includes("\\") ? (
                      <KaTeXView content={q.text} isDark={isDark} />
                    ) : (
                      <Text style={[styles.questionText, { color: colors.text }]}>{q.text}</Text>
                    )}
                  </View>

                  <View style={styles.answersBlock}>
                    {q.options.map((opt, oIdx) => {
                      const isPicked = pickedIndex === oIdx;
                      const isRightAnswer = q.correctAnswer === oIdx;

                      let optBg: string = colors.cardElevated;
                      let optBorder: string = "transparent";
                      let optTextColor: string = colors.text;

                      if (isRightAnswer) {
                        optBg = "rgba(16, 185, 129, 0.15)";
                        optBorder = "#10B981";
                        optTextColor = "#10B981";
                      } else if (isPicked && !isRightAnswer) {
                        optBg = "rgba(244, 63, 94, 0.15)";
                        optBorder = "#F43F5E";
                        optTextColor = "#F43F5E";
                      }

                      return (
                        <View
                          key={oIdx}
                          style={[
                            styles.optionRow,
                            {
                              backgroundColor: optBg,
                              borderColor: optBorder,
                              borderWidth: optBorder !== "transparent" ? 1 : 0,
                            },
                          ]}
                        >
                          <Text style={[styles.optLetter, { color: optTextColor }]}>
                            {letters[oIdx]}.
                          </Text>
                          <View style={{ flex: 1 }}>
                            {opt.includes("$") || opt.includes("\\") ? (
                              <KaTeXView content={opt} isDark={isDark} />
                            ) : (
                              <Text style={[styles.optString, { color: optTextColor }]}>
                                {opt}
                              </Text>
                            )}
                          </View>
                          {isRightAnswer && (
                            <PassCBTIcon name="checkmark-circle" size={moderateScale(16)} color="#10B981" />
                          )}
                          {isPicked && !isRightAnswer && (
                            <PassCBTIcon name="close-circle" size={moderateScale(16)} color="#F43F5E" />
                          )}
                        </View>
                      );
                    })}
                  </View>

                  {q.explanation && (
                    <View style={[styles.explanationCard, { backgroundColor: isDark ? "#171B2B" : "#F4F1FD" }]}>
                      <View style={styles.expHeader}>
                        <PassCBTIcon name="bulb-outline" size={moderateScale(15)} color="#5F33E1" />
                        <Text style={styles.expTitle}>Worked Explanation</Text>
                      </View>
                      {q.explanation.includes("$") || q.explanation.includes("\\") ? (
                        <KaTeXView content={q.explanation} isDark={isDark} />
                      ) : (
                        <Text style={[styles.expText, { color: colors.text }]}>{q.explanation}</Text>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View style={styles.bottomBarRow}>
          <TouchableOpacity
            style={[styles.againBtn, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}
            onPress={() => router.push("/tests/jamb")}
            activeOpacity={0.8}
          >
            <PassCBTIcon name="refresh" size={moderateScale(16)} color="#5F33E1" />
            <Text style={styles.againBtnText}>Practice Again</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <PassCBTButton
              title="Return Home"
              showArrow
              onPress={() => router.replace("/(tabs)")}
            />
          </View>
        </View>
      </View>
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
  scroll: {
    padding: moderateScale(18),
    paddingBottom: moderateScale(110),
  },
  heroScoreCard: {
    backgroundColor: "#5F33E1",
    borderRadius: moderateScale(24),
    padding: moderateScale(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(16),
  },
  heroScoreLeft: {
    flex: 1,
    paddingRight: moderateScale(14),
  },
  scoreTitle: {
    color: "#FFFFFF",
    fontSize: moderateScale(17),
    fontFamily: PassCBTTheme.fonts.extraBold,
    marginBottom: moderateScale(4),
  },
  scoreSub: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.regular,
    marginBottom: moderateScale(12),
  },
  scorePillsRow: {
    flexDirection: "row",
    gap: moderateScale(8),
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(8),
    gap: moderateScale(4),
  },
  statPillText: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  heroScoreRight: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyFilterWrap: {
    alignItems: "center",
    justifyContent: "center",
    padding: moderateScale(28),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    marginTop: moderateScale(14),
  },
  emptyFilterTitle: {
    fontSize: moderateScale(16),
    fontFamily: PassCBTTheme.fonts.extraBold,
    marginTop: moderateScale(12),
    marginBottom: moderateScale(4),
  },
  emptyFilterSub: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.regular,
    textAlign: "center",
    lineHeight: moderateScale(18),
    marginBottom: moderateScale(16),
  },
  resetFilterBtn: {
    backgroundColor: PassCBTTheme.brand.primarySurface,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(12),
  },
  resetFilterBtnText: {
    color: "#5F33E1",
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  questionsList: {
    marginTop: moderateScale(14),
    gap: moderateScale(14),
  },
  solutionCard: {
    borderRadius: moderateScale(18),
    borderWidth: 1,
    padding: moderateScale(16),
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(12),
  },
  qNumBox: {
    backgroundColor: PassCBTTheme.brand.primarySurface,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(8),
  },
  qNumText: {
    color: "#5F33E1",
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  outcomeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(8),
    gap: moderateScale(4),
  },
  outcomeText: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  questionTextWrap: {
    marginBottom: moderateScale(12),
  },
  questionText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    fontFamily: PassCBTTheme.fonts.semiBold,
  },
  answersBlock: {
    gap: moderateScale(8),
    marginBottom: moderateScale(10),
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    gap: moderateScale(8),
  },
  optLetter: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  optString: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.medium,
  },
  explanationCard: {
    padding: moderateScale(14),
    borderRadius: moderateScale(14),
    marginTop: moderateScale(6),
  },
  expHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
    marginBottom: moderateScale(6),
  },
  expTitle: {
    color: "#5F33E1",
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  expText: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.regular,
    lineHeight: moderateScale(19),
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(12),
    paddingBottom: moderateScale(16),
    borderTopWidth: 1,
  },
  bottomBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
  },
  againBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(16),
    borderRadius: moderateScale(18),
    borderWidth: 1,
    gap: moderateScale(6),
  },
  againBtnText: {
    color: "#5F33E1",
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.bold,
  },
});
