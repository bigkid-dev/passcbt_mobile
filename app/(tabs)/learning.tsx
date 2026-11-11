import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { moderateScale } from "react-native-size-matters";
import { useSubjects, useSubjectTopics } from "../../hooks/useTopics";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useStudentStore } from "../../store/useStudentStore";
import { PassCBTTheme } from "../../constants/theme";
import { PassCBTHeader } from "../../components/design/PassCBTHeader";
import { PassCBTIcon } from "../../components/design/PassCBTSvgIcons";

export default function LearningScreen() {
  const router = useRouter();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme !== "light";
  const colors = isDark ? PassCBTTheme.dark : PassCBTTheme.light;
  const userId = useStudentStore((s) => s.userId) || "guest_student";

  const { data: allSubjects = [], isLoading: loadingSubjects } = useSubjects();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  React.useEffect(() => {
    if (allSubjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(allSubjects[0].id);
    }
  }, [allSubjects, selectedSubjectId]);

  const activeSubject = useMemo(() => {
    return allSubjects.find((s) => s.id === selectedSubjectId) || allSubjects[0];
  }, [allSubjects, selectedSubjectId]);

  const { data: topics = [], isLoading: loadingTopics } = useSubjectTopics(
    activeSubject?.id,
    userId
  );

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const q = searchQuery.toLowerCase();
    return topics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.syllabusTitle && t.syllabusTitle.toLowerCase().includes(q))
    );
  }, [topics, searchQuery]);

  const completedCount = useMemo(() => {
    return topics.filter((t) => t.isComplete).length;
  }, [topics]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <PassCBTHeader
        title="Learning Notes"
        rightAction={
          topics.length > 0 ? (
            <View style={styles.statBadge}>
              <PassCBTIcon name="checkmark-circle" size={moderateScale(14)} color="#10B981" />
              <Text style={styles.statBadgeText}>
                {completedCount}/{topics.length}
              </Text>
            </View>
          ) : undefined
        }
      />

      <View style={styles.subjectsContainer}>
        {loadingSubjects ? (
          <ActivityIndicator size="small" color="#5F33E1" style={{ marginVertical: 8 }} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subjectsScroll}
          >
            {allSubjects.map((sub) => {
              const isSelected = sub.id === (activeSubject?.id || selectedSubjectId);
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
                    setSearchQuery("");
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
                      styles.subjectText,
                      { color: isSelected ? "#FFFFFF" : colors.text, fontWeight: isSelected ? "700" : "500" },
                    ]}
                  >
                    {sub.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      <View style={styles.searchWrapper}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <PassCBTIcon name="search" size={moderateScale(18)} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search syllabus topics..."
            placeholderTextColor={colors.textSubtle}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <PassCBTIcon name="close-circle" size={moderateScale(16)} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {loadingTopics ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5F33E1" />
        </View>
      ) : filteredTopics.length === 0 ? (
        <View style={styles.emptyContainer}>
          <PassCBTIcon name="document-text-outline" size={moderateScale(48)} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Topics Found</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
            {searchQuery
              ? "No topics match your search criteria."
              : "No notes available for this subject."}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {filteredTopics.map((topic, index) => {
            return (
              <TouchableOpacity
                key={topic.id}
                style={[
                  styles.topicCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: topic.isComplete ? "rgba(16, 185, 129, 0.4)" : colors.border,
                  },
                ]}
                activeOpacity={0.75}
                onPress={() => router.push(`/learning/${topic.id}`)}
              >
                <View
                  style={[
                    styles.topicIndexBadge,
                    {
                      backgroundColor: topic.isComplete
                        ? "rgba(16, 185, 129, 0.15)"
                        : PassCBTTheme.brand.primarySurface,
                    },
                  ]}
                >
                  {topic.isComplete ? (
                    <PassCBTIcon name="checkmark" size={moderateScale(15)} color="#10B981" />
                  ) : (
                    <Text style={styles.topicIndexText}>{topic.order ?? index + 1}</Text>
                  )}
                </View>

                <View style={styles.topicCardContent}>
                  <View style={styles.topicMetaRow}>
                    <Text style={[styles.syllabusCategory, { color: colors.textMuted }]} numberOfLines={1}>
                      {topic.syllabusTitle || activeSubject?.name || "Topic"}
                    </Text>
                    <View style={styles.readingTimeWrap}>
                      <PassCBTIcon name="time-outline" size={moderateScale(11)} color={colors.textMuted} />
                      <Text style={[styles.readingTimeText, { color: colors.textMuted }]}>
                        8 min read
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.topicTitle, { color: colors.text }]} numberOfLines={2}>
                    {topic.title}
                  </Text>
                </View>

                <PassCBTIcon
                  name="chevron-forward"
                  size={moderateScale(18)}
                  color={colors.textSubtle}
                  style={{ alignSelf: "center" }}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(10),
    gap: moderateScale(4),
  },
  statBadgeText: {
    color: "#10B981",
    fontSize: moderateScale(12),
    fontFamily: PassCBTTheme.fonts.bold,
  },
  subjectsContainer: {
    paddingVertical: moderateScale(8),
  },
  subjectsScroll: {
    paddingHorizontal: moderateScale(18),
    gap: moderateScale(8),
  },
  subjectChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(9),
    borderRadius: moderateScale(14),
    borderWidth: 1,
    gap: moderateScale(6),
  },
  subjectText: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.medium,
  },
  searchWrapper: {
    paddingHorizontal: moderateScale(18),
    marginVertical: moderateScale(10),
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(14),
    borderWidth: 1,
    gap: moderateScale(8),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.regular,
    padding: 0,
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
    fontFamily: PassCBTTheme.fonts.extraBold,
    marginTop: moderateScale(12),
  },
  emptySubtitle: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.regular,
    textAlign: "center",
    marginTop: moderateScale(6),
  },
  scroll: {
    paddingHorizontal: moderateScale(18),
    paddingBottom: moderateScale(90),
  },
  topicCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: moderateScale(15),
    borderRadius: moderateScale(18),
    borderWidth: 1,
    marginBottom: moderateScale(10),
    gap: moderateScale(12),
  },
  topicIndexBadge: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(11),
    alignItems: "center",
    justifyContent: "center",
    marginTop: moderateScale(2),
  },
  topicIndexText: {
    fontSize: moderateScale(13),
    fontFamily: PassCBTTheme.fonts.bold,
    color: "#5F33E1",
  },
  topicCardContent: {
    flex: 1,
  },
  topicMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(4),
  },
  syllabusCategory: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.semiBold,
    flex: 1,
    marginRight: moderateScale(8),
  },
  readingTimeWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(3),
  },
  readingTimeText: {
    fontSize: moderateScale(11),
    fontFamily: PassCBTTheme.fonts.regular,
  },
  topicTitle: {
    fontSize: moderateScale(14),
    fontFamily: PassCBTTheme.fonts.bold,
    lineHeight: moderateScale(20),
  },
});
