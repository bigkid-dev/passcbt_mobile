import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type {
  users,
  subjects,
  userSubjects,
  syllabi,
  topics,
  subtopics,
  questions,
  exams,
  examResults,
  examSessions,
  progress,
  topicsCompleted,
  noteContents,
  noteSubContents,
  studyPlans,
  studyPlanItems,
  leaderboard,
  appSettings,
  syncOutbox,
  ExamType,
  DifficultyLevel,
  BoardType,
  SyncStatus,
  OutboxAction,
  OutboxStatus,
  ThemeType,
} from "../db/schema";

export type {
  ExamType,
  DifficultyLevel,
  BoardType,
  SyncStatus,
  OutboxAction,
  OutboxStatus,
  ThemeType,
};

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Subject = InferSelectModel<typeof subjects>;
export type NewSubject = InferInsertModel<typeof subjects>;

export type UserSubject = InferSelectModel<typeof userSubjects>;
export type NewUserSubject = InferInsertModel<typeof userSubjects>;

export type Syllabus = InferSelectModel<typeof syllabi>;
export type NewSyllabus = InferInsertModel<typeof syllabi>;

export type Topic = InferSelectModel<typeof topics>;
export type NewTopic = InferInsertModel<typeof topics>;

export type Subtopic = InferSelectModel<typeof subtopics>;
export type NewSubtopic = InferInsertModel<typeof subtopics>;

export type Question = InferSelectModel<typeof questions>;
export type NewQuestion = InferInsertModel<typeof questions>;

export type Exam = InferSelectModel<typeof exams>;
export type NewExam = InferInsertModel<typeof exams>;

export type ExamWithQuestions = Exam & {
  questions: Question[];
};

export type ExamResultModel = InferSelectModel<typeof examResults>;
export type NewExamResultModel = InferInsertModel<typeof examResults>;

export type ExamSession = InferSelectModel<typeof examSessions>;
export type NewExamSession = InferInsertModel<typeof examSessions>;

export type Progress = InferSelectModel<typeof progress>;
export type NewProgress = InferInsertModel<typeof progress>;

export type TopicCompleted = InferSelectModel<typeof topicsCompleted>;
export type NewTopicCompleted = InferInsertModel<typeof topicsCompleted>;

export type NoteContent = InferSelectModel<typeof noteContents>;
export type NewNoteContent = InferInsertModel<typeof noteContents>;

export type NoteSubContent = InferSelectModel<typeof noteSubContents>;
export type NewNoteSubContent = InferInsertModel<typeof noteSubContents>;

export type StudyPlan = InferSelectModel<typeof studyPlans>;
export type NewStudyPlan = InferInsertModel<typeof studyPlans>;

export type StudyPlanItem = InferSelectModel<typeof studyPlanItems>;
export type NewStudyPlanItem = InferInsertModel<typeof studyPlanItems>;

export type LeaderboardEntry = InferSelectModel<typeof leaderboard>;
export type NewLeaderboardEntry = InferInsertModel<typeof leaderboard>;

export type AppSettings = InferSelectModel<typeof appSettings>;
export type NewAppSettings = InferInsertModel<typeof appSettings>;

export type SyncOutboxItem = InferSelectModel<typeof syncOutbox>;
export type NewSyncOutboxItem = InferInsertModel<typeof syncOutbox>;

export interface UIQuestion {
  id?: string;
  text: string;
  options: string[];
  correctAnswer: number;
  instruction?: string;
  board?: BoardType;
  fastestSolve?: string | null;
  explanation?: string;
  type?: string;
  year?: string | number | null;
  examId?: string | null;
  topicId?: string | null;
  topicName?: string | null;
  subTopic?: string | null;
  subjectName?: string | null;
  html?: string | null;
  isCalc?: boolean;
}

export interface UIExam {
  id?: string;
  title: string;
  subject: string;
  class: string;
  timeLimit: number;
  startTime: string;
  endTime: string;
  isPublished: boolean;
  questions: UIQuestion[];
}

export interface FormExam {
  title: string;
  subject: string;
  topic: string;
  timeLimit: number;
  isPublished: boolean;
  questions: UIQuestion[];
  class: string;
  startTime: string;
  endTime: string;
}

export type UpdateExamDTO = {
  id: string;
  title?: string;
  subject?: string;
  class?: string;
  timeLimit?: number;
  startTime?: Date;
  endTime?: Date;
};

export interface ExamResult {
  id: string;
  studentId: string;
  examId: string;
  studentName: string;
  studentClass: string;
  score: number;
  totalQuestions: number;
  answers: Record<string, number>;
  dateTaken: string;
  timeTaken: number;
}

export interface StudentAnswer {
  questionId: string;
  selectedAnswer: number;
}

export const CLASSES = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"] as const;
export type ClassType = (typeof CLASSES)[number];

export const SUBJECTS = [
  "Computer_Science",
  "English_Language",
  "Mathematics",
  "Fine_Art",
  "Civic",
  "History",
  "PVS",
  "BST",
  "PHE",
  "Yoruba",
  "Data",
  "Business_Studies",
  "Economics",
] as const;
export type SubjectNameType = (typeof SUBJECTS)[number];
