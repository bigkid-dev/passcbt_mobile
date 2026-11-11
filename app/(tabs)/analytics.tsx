import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { PassCBTIcon } from "../../components/design/PassCBTSvgIcons";
import { useOverallAnalytics } from "../../hooks/useAnalytics";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useStudentStore } from "../../store/useStudentStore";
import { PassCBTTheme } from "../../constants/theme";
import { PassCBTHeader } from "../../components/design/PassCBTHeader";

export default function AnalyticsScreen() {
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme !== "light";
  const colors = isDark ? PassCBTTheme.dark : PassCBTTheme.light;
  const userId = useStudentStore((s) => s.userId) || "guest_student";

  const { data: analytics, isLoading } = useOverallAnalytics(userId);
  const { data: leaderboardData } = useLeaderboard(userId);

  const currentUserRank = useMemo(() => {
    return leaderboardData?.myEntry ?? null;
  }, [leaderboardData]);

  const formatStudyTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const rem = minutes % 60;
    return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
  };

  const maxWeeklyQuestions = useMemo(() => {
    if (!analytics?.weekActivity || analytics.weekActivity.length === 0) return 10;
    const maxVal = Math.max(...analytics.weekActivity.map((d) => d.questionsAnswered));
    return maxVal > 0 ? maxVal : 10;
  }, [analytics]);

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <PassCBTHeader
        title="Performance"
        rightAction={
          currentUserRank ? (
            <View style={styles.rankBadge}>
              <PassCBTIcon name="trophy" size={moderateScale(14)} color="#EAB308" />
              <Text style={styles.rankBadgeText}>{currentUserRank.xp} XP</Text>
            </View>
          ) : undefined
        }
      />

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5F33E1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.metricsGrid}>
            <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.metricIconWrap, { backgroundColor: PassCBTTheme.brand.primarySurface }]}>
                <PassCBTIcon name="speedometer" size={moderateScale(20)} color="#5F33E1" />
              </View>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {analytics?.overall.averageScore ?? 0}%
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Average Score</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.metricIconWrap, { backgroundColor: "#E8F8F0" }]}>
                <PassCBTIcon name="reader" size={moderateScale(20)} color="#10B981" />
              </View>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {analytics?.overall.totalExams ?? 0}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Exams Taken</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.metricIconWrap, { backgroundColor: "#FFF0E6" }]}>
                <PassCBTIcon name="checkmark-done-circle" size={moderateScale(20)} color="#FF6633" />
              </View>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {analytics?.overall.topicsCompleted ?? 0}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Topics Mastered</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.metricIconWrap, { backgroundColor: "#F3E8FF" }]}>
                <PassCBTIcon name="time" size={moderateScale(20)} color="#8B5CF6" />
              </View>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {formatStudyTime(analytics?.overall.studyTimeMinutes ?? 0)}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Study Time</Text>
            </View>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>7-Day Activity</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
                  Questions answered daily
                </Text>
              </View>
              <PassCBTIcon name="bar-chart-outline" size={moderateScale(20)} color="#5F33E1" />
            </View>

            <View style={styles.chartContainer}>
              {analytics?.weekActivity.map((day, idx) => {
                const heightPct = Math.max(12, Math.round((day.questionsAnswered / maxWeeklyQuestions) * 100));
                const dayDate = new Date(day.date);
                const dayName = dayLabels[dayDate.getDay()];
                const isToday = idx === (analytics.weekActivity.length - 1);

                return (
                  <View key={day.date} style={styles.barColumn}>
                    <View style={[styles.barTrack, { backgroundColor: colors.cardElevated }]}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: `${heightPct}%`,
                            backgroundColor: isToday ? "#5F33E1" : "rgba(95, 51, 225, 0.35)",
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.barLabel,
                        { color: isToday ? "#5F33E1" : colors.textMuted, fontWeight: isToday ? "800" : "500" },
                      ]}
                    >
                      {dayName}
                    </Text>
                    <Text style={[styles.barCount, { color: colors.textMuted }]}>
                      {day.questionsAnswered}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Subject Mastery</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
                  Proficiency across curriculum areas
                </Text>
              </View>
              <PassCBTIcon name="school-outline" size={moderateScale(20)} color="#10B981" />
            </View>

            {analytics?.subjectPerformance && analytics.subjectPerformance.length > 0 ? (
              <View style={styles.subjectList}>
                {analytics.subjectPerformance.map((sub) => {
                  const score = sub.averageScore || 0;
                  const barColor = score >= 70 ? "#10B981" : score >= 50 ? "#5F33E1" : "#FF6633";

                  return (
                    <View key={sub.subjectId} style={styles.subjectRow}>
                      <View style={styles.subjectMeta}>
                        <Text style={[styles.subjectNameText, { color: colors.text }]}>
                          {sub.subjectName}
                        </Text>
                        <Text style={[styles.subjectScoreText, { color: barColor }]}>
                          {score}%
                        </Text>
                      </View>

                      <View style={[styles.progressTrack, { backgroundColor: colors.cardElevated }]}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${Math.min(100, Math.max(5, score))}%`, backgroundColor: barColor },
                          ]}
                        />
                      </View>

                      <View style={styles.subjectFooterRow}>
                        <Text style={[styles.subCompletedText, { color: colors.textMuted }]}>
                          {sub.completedTopics} topics mastered
                        </Text>
                        <Text style={[styles.statusText, { color: barColor }]}>
                          {score >= 70 ? "Proficient" : score >= 50 ? "Competent" : "Needs Review"}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptySubjectWrap}>
                <Text style={[styles.emptySubjectText, { color: colors.textMuted }]}>
                  Complete your first exam to view subject mastery breakdowns.
                </Text>
              </View>
            )}
          </View>

          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>National Leaderboard</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
                  Top performers in CBT practice competitions
                </Text>
              </View>
              <PassCBTIcon name="trophy" size={moderateScale(20)} color="#F59E0B" />
            </View>

            {leaderboardData?.entries && leaderboardData.entries.length > 0 ? (
              <View style={styles.leaderboardList}>
                {leaderboardData.entries.slice(0, 10).map((entry) => {
                  const isTop3 = entry.rank <= 3;
                  const rankColor =
                    entry.rank === 1 ? "#F59E0B" : entry.rank === 2 ? "#94A3B8" : entry.rank === 3 ? "#D97706" : colors.textMuted;

                  return (
                    <View
                      key={entry.userId}
                      style={[
                        styles.leaderboardRow,
                        {
                          backgroundColor: entry.isCurrentUser
                            ? PassCBTTheme.brand.primarySurface
                            : colors.cardElevated,
                          borderColor: entry.isCurrentUser ? "#5F33E1" : "transparent",
                          borderWidth: entry.isCurrentUser ? 1.5 : 0,
                        },
                      ]}
                    >
                      <View style={[styles.rankBox, isTop3 && { backgroundColor: `${rankColor}20` }]}>
                        <Text style={[styles.rankNumber, { color: rankColor }]}>
                          #{entry.rank}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.leadAvatar,
                          { backgroundColor: entry.isCurrentUser ? "#5F33E1" : "rgba(95, 51, 225, 0.15)" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.leadAvatarText,
                            { color: entry.isCurrentUser ? "#FFFFFF" : "#5F33E1" },
                          ]}
                        >
                          {entry.avatarInitials}
                        </Text>
                      </View>

                      <View style={styles.leadInfo}>
                        <Text
                          style={[
                            styles.leadName,
                            { color: colors.text, fontWeight: entry.isCurrentUser ? "800" : "600" },
                          ]}
                          numberOfLines={1}
                        >
                          {entry.displayName} {entry.isCurrentUser ? "(You)" : ""}
                        </Text>
                      </View>

                      <View style={styles.leadXpWrap}>
                        <PassCBTIcon name="sparkles" size={moderateScale(12)} color="#F59E0B" />
                        <Text style={[styles.leadXpText, { color: colors.text }]}>{entry.xp} XP</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptySubjectWrap}>
                <Text style={[styles.emptySubjectText, { color: colors.textMuted }]}>
                  Take practice exams to earn XP points and join the national leaderboard!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
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
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(234, 179, 8, 0.15)",
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(10),
    gap: moderateScale(4),
  },
  rankBadgeText: {
    color: "#EAB308",
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  scroll: {
    padding: moderateScale(18),
    paddingBottom: moderateScale(90),
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(10),
    marginBottom: moderateScale(16),
  },
  metricCard: {
    flex: 1,
    minWidth: "46%",
    padding: moderateScale(16),
    borderRadius: moderateScale(20),
    borderWidth: 1,
  },
  metricIconWrap: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateScale(10),
  },
  metricValue: {
    fontSize: moderateScale(22),
    fontFamily: PassCBTTheme.fonts.extraBold,
    marginBottom: moderateScale(2),
  },
  metricLabel: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.medium,
  },
  sectionCard: {
    padding: moderateScale(18),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    marginBottom: moderateScale(16),
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: moderateScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  sectionSubtitle: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.regular,
    marginTop: moderateScale(2),
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: moderateScale(140),
    paddingTop: moderateScale(10),
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
  },
  barTrack: {
    width: moderateScale(14),
    height: moderateScale(90),
    justifyContent: "flex-end",
    borderRadius: moderateScale(7),
    overflow: "hidden",
    marginBottom: moderateScale(6),
  },
  barFill: {
    width: "100%",
    borderRadius: moderateScale(7),
  },
  barLabel: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.medium,
  },
  barCount: {
    fontSize: moderateScale(10),
    fontFamily: PassCBTTheme.fonts.bold,
    marginTop: moderateScale(2),
  },
  subjectList: {
    gap: moderateScale(14),
  },
  subjectRow: {
    gap: moderateScale(6),
  },
  subjectMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subjectNameText: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.semiBold,
  },
  subjectScoreText: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  progressTrack: {
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: moderateScale(3),
  },
  subjectFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subCompletedText: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.regular,
  },
  statusText: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  emptySubjectWrap: {
    paddingVertical: moderateScale(14),
    alignItems: "center",
  },
  emptySubjectText: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.regular,
    textAlign: "center",
    lineHeight: moderateScale(18),
  },
  leaderboardList: {
    gap: moderateScale(10),
  },
  leaderboardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(12),
    borderRadius: moderateScale(14),
    gap: moderateScale(10),
  },
  rankBox: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(8),
    alignItems: "center",
    justifyContent: "center",
  },
  rankNumber: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  leadAvatar: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    alignItems: "center",
    justifyContent: "center",
  },
  leadAvatarText: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.medium,
  },
  leadXpWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(8),
  },
  leadXpText: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.bold,
    color: "#F59E0B",
  },
});
