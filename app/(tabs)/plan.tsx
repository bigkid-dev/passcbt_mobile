import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import {
  useStudyPlans,
  useGenerateStudyPlanMutation,
  useToggleStudyPlanItemMutation,
  useDeleteStudyPlanMutation,
} from "../../hooks/useStudyPlans";
import { useSubjects } from "../../hooks/useTopics";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useStudentStore } from "../../store/useStudentStore";
import { syllabusList } from "../../lib/data";
import { db } from "../../db/client";
import { syllabi, topics, generateUUID } from "../../db/schema";
import { eq } from "drizzle-orm";
import { PassCBTTheme } from "../../constants/theme";
import { PassCBTHeader } from "../../components/design/PassCBTHeader";
import { DateStrip } from "../../components/design/DateStrip";
import { FilterChips } from "../../components/design/FilterChips";
import { PassCBTButton } from "../../components/design/PassCBTButton";
import { PassCBTInput } from "../../components/design/PassCBTInput";
import { PassCBTIcon } from "../../components/design/PassCBTSvgIcons";
import type { StudyPlanConfig, Syllabus } from "../../lib/algorithm/studyPlan";

async function getOrInitSubjectSyllabus(
  subjectId: string,
  subjectName: string,
  subjectCode: string
): Promise<Syllabus> {
  const existingSyllabi = await db
    .select()
    .from(syllabi)
    .where(eq(syllabi.subjectId, subjectId))
    .limit(1);

  let syllabusId: string;
  if (existingSyllabi.length > 0) {
    syllabusId = existingSyllabi[0].id;
  } else {
    syllabusId = generateUUID();
    await db.insert(syllabi).values({
      id: syllabusId,
      subjectId,
      title: `${subjectName} 30-Day Syllabus`,
      order: 1,
      syncStatus: "synced",
    });
  }

  let dbTopics = await db
    .select()
    .from(topics)
    .where(eq(topics.syllabusId, syllabusId));

  if (dbTopics.length === 0) {
    const code = subjectCode.toUpperCase();
    const rawList = syllabusList[code] || [];
    const topicsToInsert =
      rawList.length > 0
        ? rawList.map((item, index) => ({
            id: generateUUID(),
            syllabusId,
            title: item.Topic,
            order: index + 1,
            explanation: `Core study notes and concepts for ${item.Topic}.`,
            syncStatus: "synced" as const,
          }))
        : Array.from({ length: 15 }, (_, i) => ({
            id: generateUUID(),
            syllabusId,
            title: `${subjectName} Unit ${i + 1}`,
            order: i + 1,
            explanation: `Mastery drills and concepts for ${subjectName} unit ${i + 1}.`,
            syncStatus: "synced" as const,
          }));

    await db.insert(topics).values(topicsToInsert);
    dbTopics = await db
      .select()
      .from(topics)
      .where(eq(topics.syllabusId, syllabusId));
  }

  return {
    id: syllabusId,
    title: `${subjectName} Syllabus`,
    subjectId,
    topics: dbTopics.map((t) => ({
      id: t.id,
      title: t.title,
      order: t.order,
      explanation: t.explanation || undefined,
    })),
  };
}

const FILTER_ITEMS = ["All", "To do", "In Progress", "Done"];

export default function StudyPlanScreen() {
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme !== "light";
  const colors = isDark ? PassCBTTheme.dark : PassCBTTheme.light;
  const userId = useStudentStore((s) => s.userId) || "guest_student";

  const { data: plans = [], isLoading } = useStudyPlans(userId);
  const { data: allSubjects = [] } = useSubjects();

  const generatePlanMutation = useGenerateStudyPlanMutation();
  const toggleItemMutation = useToggleStudyPlanItemMutation();
  const deletePlanMutation = useDeleteStudyPlanMutation();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [hoursPerDay, setHoursPerDay] = useState<number>(2);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const currentPlan = useMemo(() => {
    return plans.length > 0 ? plans[0] : null;
  }, [plans]);

  const allItems = useMemo(() => {
    if (!currentPlan) return [];
    return currentPlan.items;
  }, [currentPlan]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "Done") {
      return allItems.filter((i) => i.completed);
    }
    if (activeFilter === "To do") {
      return allItems.filter((i) => !i.completed);
    }
    return allItems;
  }, [allItems, activeFilter]);

  const handleToggle = async (itemId: string, currentStatus: boolean) => {
    try {
      await toggleItemMutation.mutateAsync({
        itemId,
        completed: !currentStatus,
        userId,
      });
    } catch (err) {
      console.error("Toggle item failed:", err);
    }
  };

  const handleGenerate = async () => {
    const subject = allSubjects.find((s) => s.id === selectedSubjectId) || allSubjects[0];
    if (!subject) {
      Alert.alert("Select Subject", "Please pick a subject.");
      return;
    }

    setIsGenerating(true);
    try {
      const syllabus = await getOrInitSubjectSyllabus(subject.id, subject.name, subject.code);

      const config: StudyPlanConfig = {
        startDate: selectedDate,
        hoursPerDay,
        daysPerWeek: [1, 2, 3, 4, 5, 6],
        includeWeekends: true,
        difficultyLevel: "medium",
        preferredStudyTime: "morning",
      };

      await generatePlanMutation.mutateAsync({
        userId,
        syllabi: [syllabus],
        config,
      });

      setModalVisible(false);
    } catch (err) {
      console.error("Generate plan error:", err);
      Alert.alert("Error", "Could not generate plan.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <PassCBTHeader
        title="Today's Tasks"
        rightAction={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              if (allSubjects.length > 0 && !selectedSubjectId) {
                setSelectedSubjectId(allSubjects[0].id);
              }
              setModalVisible(true);
            }}
          >
            <PassCBTIcon name="add" size={moderateScale(20)} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      <FilterChips
        items={FILTER_ITEMS}
        selected={activeFilter}
        onSelect={setActiveFilter}
      />

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5F33E1" />
        </View>
      ) : plans.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconWrap, { backgroundColor: PassCBTTheme.brand.primarySurface }]}>
            <PassCBTIcon name="calendar-outline" size={moderateScale(40)} color="#5F33E1" />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Tasks For Today</Text>
          <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
            Create your 30-day curriculum study plan to generate structured daily revision tasks.
          </Text>
          <View style={{ width: "100%", marginTop: moderateScale(16) }}>
            <PassCBTButton
              title="Create Study Plan"
              showArrow
              onPress={() => {
                if (allSubjects.length > 0 && !selectedSubjectId) {
                  setSelectedSubjectId(allSubjects[0].id);
                }
                setModalVisible(true);
              }}
            />
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {filteredItems.length === 0 ? (
            <View style={[styles.filterEmptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <PassCBTIcon
                name={activeFilter === "Done" ? "checkmark-done-circle-outline" : "sparkles-outline"}
                size={moderateScale(38)}
                color="#5F33E1"
              />
              <Text style={[styles.filterEmptyTitle, { color: colors.text }]}>
                {activeFilter === "Done" ? "No Completed Tasks Yet" : "All Tasks Completed!"}
              </Text>
              <Text style={[styles.filterEmptySub, { color: colors.textMuted }]}>
                {activeFilter === "Done"
                  ? "Tap any study task card to mark it as completed once done."
                  : "Great progress! You have completed all tasks in this filter view."}
              </Text>
              <TouchableOpacity
                style={styles.filterResetBtn}
                onPress={() => setActiveFilter("All")}
              >
                <Text style={styles.filterResetBtnText}>View All Tasks</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredItems.map((item, idx) => {
            const isDone = item.completed;
            const pastels = [
              PassCBTTheme.pastels.blue,
              PassCBTTheme.pastels.peach,
              PassCBTTheme.pastels.mint,
              PassCBTTheme.pastels.pink,
            ];
            const pastel = pastels[idx % pastels.length];

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.taskCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                activeOpacity={0.8}
                onPress={() => handleToggle(item.id, item.completed)}
              >
                <View style={styles.taskCardTop}>
                  <Text style={[styles.taskCategory, { color: colors.textMuted }]}>
                    {currentPlan?.subjectName || "Syllabus Task"}
                  </Text>
                  <View style={[styles.taskIconBadge, { backgroundColor: pastel.iconBg }]}>
                    <PassCBTIcon name="book" size={13} color={pastel.bar} />
                  </View>
                </View>

                <Text
                  style={[
                    styles.taskTitle,
                    {
                      color: isDone ? colors.textMuted : colors.text,
                      textDecorationLine: isDone ? "line-through" : "none",
                    },
                  ]}
                  numberOfLines={2}
                >
                  {item.topicTitle || `Study Task ${idx + 1}`}
                </Text>

                <View style={styles.taskCardBottom}>
                  <View style={styles.timeWrap}>
                    <PassCBTIcon name="time" size={moderateScale(14)} color="#5F33E1" />
                    <Text style={[styles.timeText, { color: colors.textMuted }]}>
                      {item.duration || 45} mins
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: isDone
                          ? "rgba(16, 185, 129, 0.15)"
                          : "rgba(95, 51, 225, 0.12)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: isDone ? "#10B981" : "#5F33E1" },
                      ]}
                    >
                      {isDone ? "Done" : "To-do"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }))}
        </ScrollView>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add Project Plan</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <PassCBTIcon name="close" size={moderateScale(22)} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={[styles.modalLabel, { color: colors.textMuted }]}>Task Group / Subject</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: moderateScale(14) }}>
                {allSubjects.map((sub) => {
                  const isSelected = sub.id === selectedSubjectId;
                  return (
                    <TouchableOpacity
                      key={sub.id}
                      style={[
                        styles.subjectModalChip,
                        {
                          backgroundColor: isSelected ? "#5F33E1" : colors.cardElevated,
                          borderColor: isSelected ? "#5F33E1" : colors.border,
                        },
                      ]}
                      onPress={() => setSelectedSubjectId(sub.id)}
                    >
                      <PassCBTIcon
                        name="book"
                        size={13}
                        color={isSelected ? "#FFFFFF" : "#5F33E1"}
                        style={{ marginRight: moderateScale(6) }}
                      />
                      <Text
                        style={[
                          styles.subjectChipText,
                          { color: isSelected ? "#FFFFFF" : colors.text, fontWeight: isSelected ? "700" : "500" },
                        ]}
                      >
                        {sub.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <PassCBTInput
                label="Project Plan Name"
                value={`${allSubjects.find((s) => s.id === selectedSubjectId)?.name || "Subject"} 30-Day Master`}
                editable={false}
                icon="briefcase"
              />

              <PassCBTInput
                label="Daily Study Commitment"
                value={`${hoursPerDay} Hours Daily Revision`}
                editable={false}
                icon="clock"
                onPress={() => setHoursPerDay((prev) => (prev >= 4 ? 1 : prev + 1))}
                rightIcon="chevron-down"
              />

              <PassCBTInput
                label="Duration Timeline"
                value="30 Calendar Days"
                editable={false}
                icon="calendar"
              />

              <View style={{ marginTop: moderateScale(16) }}>
                <PassCBTButton
                  title="Add Project"
                  loading={isGenerating}
                  onPress={handleGenerate}
                />
              </View>
            </ScrollView>
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
  addButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: "#5F33E1",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5F33E1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
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
    padding: moderateScale(28),
  },
  emptyIconWrap: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateScale(16),
  },
  emptyTitle: {
    fontSize: moderateScale(18),
    fontFamily: PassCBTTheme.fonts.extraBold,
    marginBottom: moderateScale(8),
  },
  emptyDesc: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.regular,
    textAlign: "center",
    lineHeight: moderateScale(20),
    marginBottom: moderateScale(12),
  },
  scroll: {
    paddingHorizontal: moderateScale(18),
    paddingBottom: moderateScale(90),
  },
  taskCard: {
    borderRadius: moderateScale(18),
    borderWidth: 1,
    padding: moderateScale(16),
    marginBottom: moderateScale(12),
  },
  taskCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(8),
  },
  taskCategory: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.semiBold,
  },
  taskIconBadge: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(8),
    alignItems: "center",
    justifyContent: "center",
  },
  taskTitle: {
    fontSize: moderateScale(15),
    fontFamily: PassCBTTheme.fonts.bold,
    lineHeight: moderateScale(21),
    marginBottom: moderateScale(14),
  },
  taskCardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
  },
  timeText: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.medium,
  },
  statusPill: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(8),
  },
  statusText: {
    fontSize: moderateScale(11),
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
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(18),
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontFamily: PassCBTTheme.fonts.extraBold,
  },
  modalScroll: {
    paddingBottom: moderateScale(20),
  },
  modalLabel: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.semiBold,
    marginBottom: moderateScale(8),
  },
  subjectModalChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    marginRight: moderateScale(8),
    gap: moderateScale(6),
  },
  subjectChipText: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.medium,
  },
  filterEmptyCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: moderateScale(28),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    marginTop: moderateScale(14),
  },
  filterEmptyTitle: {
    fontSize: moderateScale(16),
    fontFamily: PassCBTTheme.fonts.extraBold,
    marginTop: moderateScale(12),
    marginBottom: moderateScale(4),
  },
  filterEmptySub: {
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.regular,
    textAlign: "center",
    lineHeight: moderateScale(18),
    marginBottom: moderateScale(16),
  },
  filterResetBtn: {
    backgroundColor: PassCBTTheme.brand.primarySurface,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(12),
  },
  filterResetBtnText: {
    color: "#5F33E1",
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.bold,
  },
});
