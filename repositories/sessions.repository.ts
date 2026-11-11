import { eq, and, desc } from "drizzle-orm";
import { db } from "../db/client";
import { examSessions, generateUUID } from "../db/schema";
import type { ExamSession, NewExamSession } from "../types";
import { enqueueOutboxMutation } from "./outbox.repository";

export interface StartSessionPayload {
  examId: string;
  userId?: string;
  durationMinutes?: number;
  deviceId?: string;
}

export async function startExamSession(payload: StartSessionPayload): Promise<ExamSession> {
  const sessionId = generateUUID();
  const startedAt = new Date();
  const duration = (payload.durationMinutes ?? 40) * 60 * 1000;
  const expiresAt = new Date(startedAt.getTime() + duration);

  const sessionRow: NewExamSession = {
    id: sessionId,
    examId: payload.examId,
    userId: payload.userId || null,
    deviceId: payload.deviceId || "offline_device",
    startedAt,
    expiresAt,
    isComplete: false,
    score: null,
    timeTaken: null,
    syncStatus: "synced",
  };

  await db.insert(examSessions).values(sessionRow);
  await enqueueOutboxMutation("exam_sessions", sessionId, "INSERT", sessionRow);

  const created = await db
    .select()
    .from(examSessions)
    .where(eq(examSessions.id, sessionId))
    .limit(1);

  return created[0];
}

export async function getActiveExamSession(
  examId: string,
  userId?: string,
): Promise<ExamSession | null> {
  const conditions = [
    eq(examSessions.examId, examId),
    eq(examSessions.isComplete, false),
  ];

  if (userId) {
    conditions.push(eq(examSessions.userId, userId));
  }

  const results = await db
    .select()
    .from(examSessions)
    .where(and(...conditions))
    .orderBy(desc(examSessions.startedAt))
    .limit(1);

  return results[0] ?? null;
}

export async function finishExamSession(
  sessionId: string,
  score: number,
  timeTaken: number,
): Promise<{ success: boolean }> {
  const now = new Date();

  await db
    .update(examSessions)
    .set({
      isComplete: true,
      completedAt: now,
      score,
      timeTaken,
      updatedAt: now,
    })
    .where(eq(examSessions.id, sessionId));

  await enqueueOutboxMutation("exam_sessions", sessionId, "UPDATE", {
    isComplete: true,
    completedAt: now,
    score,
    timeTaken,
  });

  return { success: true };
}
