import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { moderateScale } from "react-native-size-matters";
import { PassCBTIcon } from "../../components/design/PassCBTSvgIcons";
import { useTopicNote } from "../../hooks/useNotes";
import { useSetTopicCompletionMutation, useCompletedTopics } from "../../hooks/useTopics";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useStudentStore } from "../../store/useStudentStore";
import { KaTeXView } from "../../components/KaTeXView";
import { PassCBTTheme } from "../../constants/theme";
import { PassCBTHeader } from "../../components/design/PassCBTHeader";
import { PassCBTButton } from "../../components/design/PassCBTButton";
import type { ContentBlock } from "../../lib/noteSchema";

export default function TopicDetailScreen() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const router = useRouter();

  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme !== "light";
  const colors = isDark ? PassCBTTheme.dark : PassCBTTheme.light;
  const userId = useStudentStore((s) => s.userId) || "guest_student";

  const { data: note, isLoading } = useTopicNote(topicId);
  const { data: completedTopics = [] } = useCompletedTopics(userId);
  const setCompletionMutation = useSetTopicCompletionMutation();

  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [toggling, setToggling] = useState<boolean>(false);

  React.useEffect(() => {
    if (topicId && completedTopics.length > 0) {
      const alreadyDone = completedTopics.some((t: any) => t.topicId === topicId);
      setIsCompleted(alreadyDone);
    }
  }, [topicId, completedTopics]);

  const handleToggleComplete = async () => {
    if (!topicId) return;
    setToggling(true);
    try {
      const nextStatus = !isCompleted;
      await setCompletionMutation.mutateAsync({
        userId,
        topicId,
        isComplete: nextStatus,
      });
      setIsCompleted(nextStatus);
    } catch (err) {
      console.error("Failed to toggle completion:", err);
      Alert.alert("Error", "Could not update status.");
    } finally {
      setToggling(false);
    }
  };

  const renderBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case "section_heading":
        return (
          <View key={index} style={styles.headingBlock}>
            <View style={styles.headingAccent} />
            <Text style={[styles.headingText, { color: colors.text }]}>{block.data.text}</Text>
          </View>
        );

      case "paragraph": {
        const containsMath =
          block.data.hasMath ||
          block.data.markdown.includes("$") ||
          block.data.markdown.includes("\\");
        return (
          <View key={index} style={styles.paragraphBlock}>
            {containsMath ? (
              <KaTeXView content={block.data.markdown} isDark={isDark} />
            ) : (
              <Text style={[styles.paragraphText, { color: colors.text }]}>
                {block.data.markdown}
              </Text>
            )}
          </View>
        );
      }

      case "definition":
        return (
          <View
            key={index}
            style={[
              styles.definitionCard,
              {
                backgroundColor: isDark ? "#171B2B" : "#F4F1FD",
                borderColor: "#5F33E1",
              },
            ]}
          >
            <View style={styles.defHeader}>
              <PassCBTIcon name="bookmark" size={moderateScale(16)} color="#5F33E1" />
              <Text style={styles.defTerm}>{block.data.term}</Text>
            </View>
            <Text style={[styles.defMarkdown, { color: colors.text }]}>{block.data.markdown}</Text>
          </View>
        );

      case "fact_grid":
        return (
          <View key={index} style={styles.factGridContainer}>
            {block.data.items.map((item, fIdx) => (
              <View
                key={fIdx}
                style={[styles.factCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.factCardHeader}>
                  <PassCBTIcon
                    name={(item.iconName as any) || "information-circle-outline"}
                    size={moderateScale(16)}
                    color="#10B981"
                  />
                  <Text style={[styles.factCardTitle, { color: colors.text }]}>{item.title}</Text>
                </View>
                <Text style={[styles.factCardMarkdown, { color: colors.textMuted }]}>
                  {item.markdown}
                </Text>
              </View>
            ))}
          </View>
        );

      case "exam_tip":
        return (
          <View
            key={index}
            style={[
              styles.tipCard,
              {
                backgroundColor: isDark ? "rgba(245, 158, 11, 0.12)" : "#FFF7ED",
                borderColor: "#F59E0B",
              },
            ]}
          >
            <View style={styles.tipHeader}>
              <View style={styles.tipBadge}>
                <Text style={styles.tipBadgeText}>{block.data.board} TIP</Text>
              </View>
              <PassCBTIcon name="bulb" size={moderateScale(18)} color="#F59E0B" />
            </View>
            <Text style={[styles.tipMarkdown, { color: isDark ? "#FDE68A" : "#9A3412" }]}>
              {block.data.markdown}
            </Text>
          </View>
        );

      case "calculation":
        return (
          <View
            key={index}
            style={[
              styles.calcCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.calcHeader}>
              <View style={styles.calcTitleWrap}>
                <PassCBTIcon name="calculator" size={moderateScale(16)} color="#5F33E1" />
                <Text style={[styles.calcTitle, { color: colors.text }]}>Worked Problem</Text>
              </View>
              {block.data.year ? (
                <View style={[styles.yearBadge, { backgroundColor: PassCBTTheme.brand.primarySurface }]}>
                  <Text style={styles.yearBadgeText}>{block.data.year}</Text>
                </View>
              ) : null}
            </View>

            <Text style={[styles.calcQuestion, { color: colors.text }]}>
              {block.data.question}
            </Text>

            <View style={[styles.solutionBox, { backgroundColor: colors.cardElevated }]}>
              <Text style={styles.solutionLabel}>Step-by-step Solution:</Text>
              <KaTeXView content={block.data.solution} isDark={isDark} />
            </View>

            <View style={styles.answerRow}>
              <Text style={[styles.answerLabel, { color: colors.textMuted }]}>Final Answer:</Text>
              <View style={styles.answerPill}>
                <Text style={styles.answerText}>{block.data.answer}</Text>
              </View>
            </View>
          </View>
        );

      case "summary":
        return (
          <View
            key={index}
            style={[
              styles.summaryCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.summaryHeader}>
              <PassCBTIcon name="checkmark-done-circle" size={moderateScale(18)} color="#10B981" />
              <Text style={[styles.summaryTitle, { color: colors.text }]}>Key Takeaways</Text>
            </View>
            {block.data.items.map((item, sIdx) => (
              <View key={sIdx} style={styles.summaryItemRow}>
                <PassCBTIcon
                  name="ellipse"
                  size={moderateScale(6)}
                  color="#10B981"
                  style={{ marginTop: moderateScale(7) }}
                />
                <Text style={[styles.summaryItemText, { color: colors.text }]}>{item}</Text>
              </View>
            ))}
          </View>
        );

      case "example":
        return (
          <View
            key={index}
            style={[
              styles.exampleCard,
              {
                backgroundColor: isDark ? "#1A1A2E" : "#F4F1FD",
                borderColor: "#5F33E1",
              },
            ]}
          >
            <Text style={styles.exampleBadge}>Example</Text>
            <Text style={[styles.exampleText, { color: colors.text }]}>{block.data.markdown}</Text>
          </View>
        );

      case "diagram":
        return (
          <View
            key={index}
            style={[styles.diagramCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.diagramTitle, { color: colors.text }]}>{block.data.title}</Text>
            {block.data.description ? (
              <Text style={[styles.diagramDesc, { color: colors.textMuted }]}>
                {block.data.description}
              </Text>
            ) : null}
            {block.data.caption ? (
              <Text style={[styles.diagramCaption, { color: colors.textSubtle }]}>
                {block.data.caption}
              </Text>
            ) : null}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <PassCBTHeader
        title={note?.subject || "Subject Note"}
        showBack
        rightAction={
          <TouchableOpacity
            style={[
              styles.checkCompleteButton,
              {
                backgroundColor: isCompleted ? "#10B981" : PassCBTTheme.brand.primarySurface,
              },
            ]}
            onPress={handleToggleComplete}
            disabled={toggling}
          >
            {toggling ? (
              <ActivityIndicator size="small" color={isCompleted ? "#FFFFFF" : "#5F33E1"} />
            ) : (
              <>
                <PassCBTIcon
                  name={isCompleted ? "checkmark-circle" : "checkmark-circle-outline"}
                  size={moderateScale(16)}
                  color={isCompleted ? "#FFFFFF" : "#5F33E1"}
                />
                <Text
                  style={[
                    styles.checkCompleteText,
                    { color: isCompleted ? "#FFFFFF" : "#5F33E1" },
                  ]}
                >
                  {isCompleted ? "Done" : "Mark Done"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        }
      />

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5F33E1" />
        </View>
      ) : !note ? (
        <View style={styles.emptyContainer}>
          <PassCBTIcon name="alert-circle-outline" size={moderateScale(48)} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Note Not Found</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
            Unable to locate syllabus notes for this topic.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={[styles.metaHeaderCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.badgeRow}>
              {note.examBoards.map((board, bIdx) => (
                <View key={bIdx} style={styles.boardBadge}>
                  <Text style={styles.boardBadgeText}>{board}</Text>
                </View>
              ))}
              <View style={[styles.freqBadge, { backgroundColor: PassCBTTheme.brand.primarySurface }]}>
                <Text style={styles.freqBadgeText}>High Yield</Text>
              </View>
              <View style={styles.readTimeBadge}>
                <PassCBTIcon name="time-outline" size={moderateScale(12)} color={colors.textMuted} />
                <Text style={[styles.readTimeText, { color: colors.textMuted }]}>
                  {note.estimatedReadMinutes} min
                </Text>
              </View>
            </View>

            <Text style={[styles.noteMainTitle, { color: colors.text }]}>{note.title}</Text>
          </View>

          <View style={styles.contentWrap}>
            {note.content.map((block, idx) => renderBlock(block, idx))}
          </View>

          <View style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.actionCardTitle, { color: colors.text }]}>
              Mastered this topic?
            </Text>
            <Text style={[styles.actionCardSubtitle, { color: colors.textMuted }]}>
              Practice targeted questions specifically from this syllabus section.
            </Text>
            <View style={{ width: "100%", marginTop: moderateScale(10) }}>
              <PassCBTButton
                title="Drill Topic Questions"
                showArrow
                onPress={() => router.push(`/tests/knowledge?subject=${note.subject}`)}
              />
            </View>
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
  checkCompleteButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(10),
    gap: moderateScale(4),
  },
  checkCompleteText: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: moderateScale(24),
  },
  emptyTitle: {
    fontSize: moderateScale(16),
    fontFamily: PassCBTTheme.fonts.bold,
    marginTop: moderateScale(12),
  },
  emptySubtitle: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.regular,
    textAlign: "center",
    marginTop: moderateScale(6),
  },
  scroll: {
    padding: moderateScale(18),
    paddingBottom: moderateScale(60),
  },
  metaHeaderCard: {
    padding: moderateScale(16),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    marginBottom: moderateScale(16),
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: moderateScale(6),
    marginBottom: moderateScale(10),
  },
  boardBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
    borderRadius: moderateScale(6),
  },
  boardBadgeText: {
    color: "#10B981",
    fontSize: moderateScale(10),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  freqBadge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
    borderRadius: moderateScale(6),
  },
  freqBadgeText: {
    color: "#5F33E1",
    fontSize: moderateScale(10),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  readTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(3),
    marginLeft: "auto",
  },
  readTimeText: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.medium,
  },
  noteMainTitle: {
    fontSize: moderateScale(20),
    fontFamily: PassCBTTheme.fonts.extraBold,
    lineHeight: moderateScale(26),
  },
  contentWrap: {
    gap: moderateScale(14),
    marginBottom: moderateScale(20),
  },
  headingBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: moderateScale(8),
    marginBottom: moderateScale(4),
    gap: moderateScale(8),
  },
  headingAccent: {
    width: moderateScale(4),
    height: moderateScale(18),
    backgroundColor: "#5F33E1",
    borderRadius: moderateScale(2),
  },
  headingText: {
    fontSize: moderateScale(17),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  paragraphBlock: {
    marginBottom: moderateScale(8),
  },
  paragraphText: {
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.regular,
    lineHeight: moderateScale(22),
  },
  definitionCard: {
    padding: moderateScale(14),
    borderRadius: moderateScale(16),
    borderLeftWidth: 4,
  },
  defHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
    marginBottom: moderateScale(6),
  },
  defTerm: {
    color: "#5F33E1",
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  defMarkdown: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.regular,
    lineHeight: moderateScale(20),
  },
  factGridContainer: {
    gap: moderateScale(8),
  },
  factCard: {
    padding: moderateScale(14),
    borderRadius: moderateScale(14),
    borderWidth: 1,
  },
  factCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
    marginBottom: moderateScale(4),
  },
  factCardTitle: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  factCardMarkdown: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.regular,
    lineHeight: moderateScale(18),
  },
  tipCard: {
    padding: moderateScale(14),
    borderRadius: moderateScale(16),
    borderWidth: 1,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(6),
  },
  tipBadge: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(6),
  },
  tipBadgeText: {
    color: "#FFFFFF",
    fontSize: moderateScale(10),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  tipMarkdown: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.medium,
    lineHeight: moderateScale(19),
  },
  calcCard: {
    padding: moderateScale(16),
    borderRadius: moderateScale(18),
    borderWidth: 1,
  },
  calcHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(8),
  },
  calcTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
  },
  calcTitle: {
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  yearBadge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(6),
  },
  yearBadgeText: {
    color: "#5F33E1",
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  calcQuestion: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.semiBold,
    marginBottom: moderateScale(10),
    lineHeight: moderateScale(19),
  },
  solutionBox: {
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(10),
  },
  solutionLabel: {
    color: "#5F33E1",
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.bold,
    marginBottom: moderateScale(6),
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  answerLabel: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.semiBold,
  },
  answerPill: {
    backgroundColor: "#10B981",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(8),
  },
  answerText: {
    color: "#FFFFFF",
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  summaryCard: {
    padding: moderateScale(16),
    borderRadius: moderateScale(18),
    borderWidth: 1,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
    marginBottom: moderateScale(10),
  },
  summaryTitle: {
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  summaryItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: moderateScale(8),
    marginBottom: moderateScale(6),
  },
  summaryItemText: {
    flex: 1,
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.regular,
    lineHeight: moderateScale(18),
  },
  exampleCard: {
    padding: moderateScale(14),
    borderRadius: moderateScale(16),
    borderLeftWidth: 4,
  },
  exampleBadge: {
    color: "#5F33E1",
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.extraBold,
    marginBottom: moderateScale(4),
    textTransform: "uppercase",
  },
  exampleText: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.regular,
    lineHeight: moderateScale(19),
  },
  diagramCard: {
    padding: moderateScale(14),
    borderRadius: moderateScale(16),
    borderWidth: 1,
  },
  diagramTitle: {
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.bold,
    marginBottom: moderateScale(4),
  },
  diagramDesc: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.regular,
    lineHeight: moderateScale(18),
  },
  diagramCaption: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.regular,
    fontStyle: "italic",
    marginTop: moderateScale(4),
  },
  actionCard: {
    padding: moderateScale(18),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    alignItems: "center",
    marginTop: moderateScale(8),
  },
  actionCardTitle: {
    fontSize: moderateScale(16),
    fontFamily: PassCBTTheme.fonts.extraBold,
    textAlign: "center",
    marginBottom: moderateScale(4),
  },
  actionCardSubtitle: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.regular,
    textAlign: "center",
    marginBottom: moderateScale(6),
    lineHeight: moderateScale(17),
  },
});
