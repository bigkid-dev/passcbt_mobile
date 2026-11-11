import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export function generateUUID(): string {
  if (typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export type ExamType = "STANDARD" | "AI_PREDICTED" | "SIMULATION" | "KNOWLEDGE" | "SPEED";
export type DifficultyLevel = "Easy" | "Medium" | "Hard";
export type BoardType = "JAMB" | "WAEC" | "NECO" | "GCE" | "POST_UTME";
export type SyncStatus = "synced" | "pending" | "error";
export type OutboxAction = "INSERT" | "UPDATE" | "DELETE";
export type OutboxStatus = "pending" | "processing" | "failed" | "synced";
export type ThemeType = "dark" | "light" | "system";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phoneNumber: text("phone_number"),
  hasOnboarded: integer("has_onboarded", { mode: "boolean" }).notNull().default(false),
  lastActiveAt: integer("last_active_at", { mode: "timestamp" }),
  totalStudyMinutes: integer("total_study_minutes").notNull().default(0),
  plan: text("plan"),
  period: text("period"),
  paystackCustomerId: text("paystack_customer_id"),
  subscriptionCode: text("subscription_code"),
  subscriptionToken: text("subscription_token"),
  isSubscribed: integer("is_subscribed", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").$type<SyncStatus>().notNull().default("synced"),
});

export const subjects = sqliteTable("subjects", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  color: text("color").default("#3E6AE1"),
  icon: text("icon").default("book"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").$type<SyncStatus>().notNull().default("synced"),
});

export const userSubjects = sqliteTable("user_subjects", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subjectId: text("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").$type<SyncStatus>().notNull().default("synced"),
}, (table) => [
  uniqueIndex("user_subject_unique_idx").on(table.userId, table.subjectId),
]);

export const syllabi = sqliteTable("syllabi", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").default(1),
  subjectId: text("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").$type<SyncStatus>().notNull().default("synced"),
});

export const topics = sqliteTable("topics", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  syllabusId: text("syllabus_id").notNull().references(() => syllabi.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  order: integer("order").default(1),
  explanation: text("explanation").notNull().default(""),
  memoryTrick: text("memory_trick").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").$type<SyncStatus>().notNull().default("synced"),
});

export const subtopics = sqliteTable("subtopics", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  topicId: text("topic_id").notNull().references(() => topics.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  order: integer("order").default(1),
  content: text("content").notNull().default(""),
  summary: text("summary").notNull().default(""),
  keyTerms: text("key_terms", { mode: "json" }).$type<Array<{ term: string; definition: string }>>().default([]),
  examTips: text("exam_tips").notNull().default(""),
  memoryTrick: text("memory_trick").notNull().default(""),
  html: text("html"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").$type<SyncStatus>().notNull().default("synced"),
}, (table) => [
  index("subtopic_topic_id_idx").on(table.topicId),
]);

export const exams = sqliteTable("exams", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  subjectId: text("subject_id").references(() => subjects.id, { onDelete: "cascade" }),
  topicId: text("topic_id").references(() => topics.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  class: text("class"),
  timeLimit: integer("time_limit").notNull().default(2400),
  startTime: integer("start_time", { mode: "timestamp" }),
  endTime: integer("end_time", { mode: "timestamp" }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
  isCompleted: integer("is_completed", { mode: "boolean" }).notNull().default(false),
  timeTaken: integer("time_taken").default(0),
  score: integer("score").notNull().default(0),
  totalQuestion: integer("total_question").notNull().default(40),
  type: text("type").$type<ExamType>().notNull().default("STANDARD"),
  answerPicked: text("answer_picked", { mode: "json" }).$type<Record<string, number>>(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").$type<SyncStatus>().notNull().default("synced"),
});

export const questions = sqliteTable("questions", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  examId: text("exam_id").references(() => exams.id, { onDelete: "cascade" }),
  topicId: text("topic_id").references(() => topics.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  options: text("options", { mode: "json" }).$type<string[]>().notNull(),
  correctAnswer: integer("correct_answer").notNull().default(0),
  instruction: text("instruction").notNull().default(""),
  explanation: text("explanation").notNull().default(""),
  fastestSolve: text("fastest_solve"),
  tip: text("tip"),
  type: text("type").$type<ExamType>().notNull().default("STANDARD"),
  difficulty: text("difficulty").$type<DifficultyLevel>().notNull().default("Easy"),
  html: text("html"),
  year: integer("year").default(2024),
  subjectName: text("subject_name"),
  topicName: text("topic_name"),
  subTopic: text("sub_topic"),
  board: text("board").$type<BoardType>().notNull().default("JAMB"),
  isCalc: integer("is_calc", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").$type<SyncStatus>().notNull().default("synced"),
}, (table) => [
  index("question_subject_idx").on(table.subjectName),
  index("question_board_idx").on(table.board),
  index("question_topic_id_idx").on(table.topicId),
]);

export const examResults = sqliteTable("exam_results", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  examId: text("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  studentId: text("student_id"),
  studentClass: text("student_class"),
  score: integer("score").notNull().default(0),
  totalQuestions: integer("total_questions").notNull().default(40),
  dateTaken: integer("date_taken", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  timeTaken: integer("time_taken").notNull().default(0),
  answer: text("answer", { mode: "json" }).$type<Record<string, number>>().notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").$type<SyncStatus>().notNull().default("synced"),
});

export const examSessions = sqliteTable("exam_sessions", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  examId: text("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  deviceId: text("device_id"),
  startedAt: integer("started_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  score: integer("score"),
  timeTaken: integer("time_taken"),
  isComplete: integer("is_complete", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").$type<SyncStatus>().notNull().default("synced"),
}, (table) => [
  index("exam_session_user_exam_idx").on(table.userId, table.examId),
]);

export const progress = sqliteTable("progress", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subjectId: text("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
  progress: integer("progress").notNull().default(0),
  lastAccessed: integer("last_accessed", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").$type<SyncStatus>().notNull().default("synced"),
});

export const topicsCompleted = sqliteTable("topics_completed", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  topicId: text("topic_id").notNull().references(() => topics.id, { onDelete: "cascade" }),
  subjectId: text("subject_id").references(() => subjects.id, { onDelete: "cascade" }),
  isComplete: integer("is_complete", { mode: "boolean" }).notNull().default(false),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  lastViewed: integer("last_viewed", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").$type<SyncStatus>().notNull().default("synced"),
}, (table) => [
  uniqueIndex("user_topic_completion_idx").on(table.userId, table.topicId),
]);

export const noteContents = sqliteTable("note_contents", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  topicId: text("topic_id").notNull().references(() => topics.id, { onDelete: "cascade" }),
  content: text("content").notNull().default(""),
  summary: text("summary").notNull().default(""),
  keyTerms: text("key_terms", { mode: "json" }).$type<Array<{ term: string; definition: string }>>().default([]),
  examTips: text("exam_tips").notNull().default(""),
  memoryTrick: text("memory_trick").notNull().default(""),
  html: text("html"),
  calculations: text("calculations", { mode: "json" }).$type<Array<{ question: string; solution: string; answer: string; year?: string }>>(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").$type<SyncStatus>().notNull().default("synced"),
});

export const noteSubContents = sqliteTable("note_sub_contents", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  noteContentId: text("note_content_id").notNull().references(() => noteContents.id, { onDelete: "cascade" }),
  subtopicId: text("subtopic_id").references(() => subtopics.id, { onDelete: "cascade" }),
  order: integer("order").default(1),
  content: text("content").notNull().default(""),
  summary: text("summary").notNull().default(""),
  keyTerms: text("key_terms", { mode: "json" }).$type<Array<{ term: string; definition: string }>>().default([]),
  examTips: text("exam_tips").notNull().default(""),
  memoryTrick: text("memory_trick").notNull().default(""),
  html: text("html"),
  type: text("type"),
  calculations: text("calculations", { mode: "json" }).$type<Array<{ question: string; solution: string; answer: string; year?: string }>>(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").$type<SyncStatus>().notNull().default("synced"),
});

export const studyPlans = sqliteTable("study_plans", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subjectId: text("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
  syllabusId: text("syllabus_id").notNull().references(() => syllabi.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
  color: text("color").notNull().default("#3B82F6"),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").$type<SyncStatus>().notNull().default("synced"),
});

export const studyPlanItems = sqliteTable("study_plan_items", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  studyPlanId: text("study_plan_id").notNull().references(() => studyPlans.id, { onDelete: "cascade" }),
  topicId: text("topic_id").notNull().references(() => topics.id, { onDelete: "cascade" }),
  date: integer("date", { mode: "timestamp" }).notNull(),
  duration: integer("duration").default(30),
  order: integer("order").notNull().default(1),
  notes: text("notes"),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").$type<SyncStatus>().notNull().default("synced"),
});

export const leaderboard = sqliteTable("leaderboard", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  userId: text("user_id").notNull(),
  displayName: text("display_name"),
  avatarInitials: text("avatar_initials"),
  imageUrl: text("image_url"),
  points: integer("points").notNull().default(0),
  rank: integer("rank").notNull().default(0),
  isCurrentUser: integer("is_current_user", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  syncStatus: text("sync_status").$type<SyncStatus>().notNull().default("synced"),
});

export const appSettings = sqliteTable("app_settings", {
  id: text("id").primaryKey().default("default"),
  theme: text("theme").$type<ThemeType>().notNull().default("dark"),
  isSubscribed: integer("is_subscribed", { mode: "boolean" }).notNull().default(false),
  offlineDownloaded: integer("offline_downloaded", { mode: "boolean" }).notNull().default(false),
  isSeeded: integer("is_seeded", { mode: "boolean" }).notNull().default(false),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const syncOutbox = sqliteTable("sync_outbox", {
  id: text("id").primaryKey().$defaultFn(() => generateUUID()),
  table: text("table").notNull(),
  rowId: text("row_id").notNull(),
  action: text("action").$type<OutboxAction>().notNull(),
  payload: text("payload", { mode: "json" }).notNull(),
  attempts: integer("attempts").notNull().default(0),
  lastAttemptAt: integer("last_attempt_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  status: text("status").$type<OutboxStatus>().notNull().default("pending"),
});

export const usersRelations = relations(users, ({ many }) => ({
  userSubjects: many(userSubjects),
  exams: many(exams),
  examResults: many(examResults),
  examSessions: many(examSessions),
  progress: many(progress),
  topicsCompleted: many(topicsCompleted),
  studyPlans: many(studyPlans),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  syllabi: many(syllabi),
  exams: many(exams),
  progress: many(progress),
  userSubjects: many(userSubjects),
}));

export const syllabiRelations = relations(syllabi, ({ one, many }) => ({
  subject: one(subjects, { fields: [syllabi.subjectId], references: [subjects.id] }),
  topics: many(topics),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  syllabus: one(syllabi, { fields: [topics.syllabusId], references: [syllabi.id] }),
  subtopics: many(subtopics),
  questions: many(questions),
  noteContents: many(noteContents),
  studyPlanItems: many(studyPlanItems),
  topicsCompleted: many(topicsCompleted),
}));

export const subtopicsRelations = relations(subtopics, ({ one, many }) => ({
  topic: one(topics, { fields: [subtopics.topicId], references: [topics.id] }),
  noteSubContents: many(noteSubContents),
}));

export const examsRelations = relations(exams, ({ one, many }) => ({
  user: one(users, { fields: [exams.userId], references: [users.id] }),
  subject: one(subjects, { fields: [exams.subjectId], references: [subjects.id] }),
  topic: one(topics, { fields: [exams.topicId], references: [topics.id] }),
  questions: many(questions),
  examResults: many(examResults),
  examSessions: many(examSessions),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  exam: one(exams, { fields: [questions.examId], references: [exams.id] }),
  topic: one(topics, { fields: [questions.topicId], references: [topics.id] }),
}));

export const examResultsRelations = relations(examResults, ({ one }) => ({
  exam: one(exams, { fields: [examResults.examId], references: [exams.id] }),
  user: one(users, { fields: [examResults.userId], references: [users.id] }),
}));

export const examSessionsRelations = relations(examSessions, ({ one }) => ({
  exam: one(exams, { fields: [examSessions.examId], references: [exams.id] }),
  user: one(users, { fields: [examSessions.userId], references: [users.id] }),
}));

export const noteContentsRelations = relations(noteContents, ({ one, many }) => ({
  topic: one(topics, { fields: [noteContents.topicId], references: [topics.id] }),
  subContent: many(noteSubContents),
}));

export const noteSubContentsRelations = relations(noteSubContents, ({ one }) => ({
  noteContent: one(noteContents, { fields: [noteSubContents.noteContentId], references: [noteContents.id] }),
  subtopic: one(subtopics, { fields: [noteSubContents.subtopicId], references: [subtopics.id] }),
}));

export const studyPlansRelations = relations(studyPlans, ({ one, many }) => ({
  user: one(users, { fields: [studyPlans.userId], references: [users.id] }),
  subject: one(subjects, { fields: [studyPlans.subjectId], references: [subjects.id] }),
  syllabus: one(syllabi, { fields: [studyPlans.syllabusId], references: [syllabi.id] }),
  items: many(studyPlanItems),
}));

export const studyPlanItemsRelations = relations(studyPlanItems, ({ one }) => ({
  studyPlan: one(studyPlans, { fields: [studyPlanItems.studyPlanId], references: [studyPlans.id] }),
  topic: one(topics, { fields: [studyPlanItems.topicId], references: [topics.id] }),
}));
