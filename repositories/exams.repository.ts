import { eq, and, desc } from "drizzle-orm";
import { db } from "../db/client";
import {
  exams,
  questions,
  examResults,
  leaderboard,
  generateUUID,
} from "../db/schema";
import type {
  Exam,
  NewExam,
  Question,
  ExamWithQuestions,
  ExamType,
} from "../types";
import { enqueueOutboxMutation } from "./outbox.repository";

export interface CreateExamPayload {
  title: string;
  subjectId?: string;
  topicId?: string;
  userId?: string;
  timeLimit?: number;
  type?: ExamType;
  totalQuestion?: number;
  questions?: Question[];
}

export interface SyncExamPayload {
  examId: string;
  score: number;
  answers: Record<string, number>;
  timeTaken: number;
  isCompleted?: boolean;
  userId?: string;
}

export async function createExam(payload: CreateExamPayload): Promise<ExamWithQuestions> {
  const examId = generateUUID();
  const timeLimit = payload.timeLimit ?? 2400;
  const examType = payload.type ?? "STANDARD";
  const questionCount = payload.questions?.length ?? payload.totalQuestion ?? 40;

  const newExam: NewExam = {
    id: examId,
    title: payload.title,
    subjectId: payload.subjectId || null,
    topicId: payload.topicId || null,
    userId: payload.userId || null,
    timeLimit,
    type: examType,
    totalQuestion: questionCount,
    isPublished: true,
    isCompleted: false,
    score: 0,
    timeTaken: 0,
    startTime: new Date(),
    syncStatus: "synced",
  };

  await db.insert(exams).values(newExam);
  await enqueueOutboxMutation("exams", examId, "INSERT", newExam);

  const assignedQuestions: Question[] = [];
  if (payload.questions && payload.questions.length > 0) {
    for (const q of payload.questions) {
      if (q.id) {
        await db
          .update(questions)
          .set({ examId })
          .where(eq(questions.id, q.id));
        assignedQuestions.push({ ...q, examId });
      } else {
        const qId = generateUUID();
        const newQ = {
          ...q,
          id: qId,
          examId,
          syncStatus: "synced" as const,
        };
        await db.insert(questions).values(newQ as any);
        assignedQuestions.push(newQ as any);
      }
    }
  }

  const created = await getExamById(examId);
  return {
    ...created!,
    questions: assignedQuestions,
  };
}

export async function getExamById(examId: string): Promise<Exam | null> {
  const result = await db.select().from(exams).where(eq(exams.id, examId)).limit(1);
  return result[0] ?? null;
}

export async function getExamWithQuestions(examId: string): Promise<ExamWithQuestions | null> {
  const examResult = await db.select().from(exams).where(eq(exams.id, examId)).limit(1);
  if (examResult.length === 0) return null;

  const exam = examResult[0];
  const examQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.examId, examId));

  return {
    ...exam,
    questions: examQuestions,
  };
}

export async function getExamHistory(params?: {
  userId?: string;
  type?: ExamType;
  limit?: number;
}): Promise<Exam[]> {
  const conditions = [];

  if (params?.userId) {
    conditions.push(eq(exams.userId, params.userId));
  }
  if (params?.type) {
    conditions.push(eq(exams.type, params.type));
  }

  const query = conditions.length > 0
    ? db.select().from(exams).where(and(...conditions)).orderBy(desc(exams.createdAt))
    : db.select().from(exams).orderBy(desc(exams.createdAt));

  return query.limit(params?.limit ?? 50);
}

export async function syncExamCompletion(payload: SyncExamPayload): Promise<{ success: boolean }> {
  const now = new Date();

  await db
    .update(exams)
    .set({
      score: payload.score,
      answerPicked: payload.answers,
      timeTaken: payload.timeTaken,
      isCompleted: payload.isCompleted ?? true,
      completedAt: now,
      updatedAt: now,
    })
    .where(eq(exams.id, payload.examId));

  await enqueueOutboxMutation("exams", payload.examId, "UPDATE", {
    score: payload.score,
    answerPicked: payload.answers,
    timeTaken: payload.timeTaken,
    isCompleted: payload.isCompleted ?? true,
    completedAt: now,
  });

  const exam = await getExamById(payload.examId);
  const resultId = generateUUID();
  const newResult = {
    id: resultId,
    examId: payload.examId,
    userId: payload.userId || exam?.userId || null,
    score: payload.score,
    totalQuestions: exam?.totalQuestion || 40,
    dateTaken: now,
    timeTaken: payload.timeTaken,
    answer: payload.answers,
    syncStatus: "synced" as const,
  };

  await db.insert(examResults).values(newResult);
  await enqueueOutboxMutation("exam_results", resultId, "INSERT", newResult);

  if (payload.userId) {
    const existingLeaderboard = await db
      .select()
      .from(leaderboard)
      .where(eq(leaderboard.userId, payload.userId))
      .limit(1);

    if (existingLeaderboard.length > 0) {
      const current = existingLeaderboard[0];
      await db
        .update(leaderboard)
        .set({
          points: current.points + payload.score,
          updatedAt: now,
        })
        .where(eq(leaderboard.id, current.id));
    } else {
      await db.insert(leaderboard).values({
        id: generateUUID(),
        userId: payload.userId,
        points: payload.score,
        rank: 1,
        isCurrentUser: true,
        syncStatus: "synced",
      });
    }
  }

  return { success: true };
}
