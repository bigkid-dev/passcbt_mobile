import { eq, and } from "drizzle-orm";
import { db } from "../db/client";
import { progress, subjects, generateUUID } from "../db/schema";
import type { Progress } from "../types";
import { enqueueOutboxMutation } from "./outbox.repository";

export interface UserSubjectProgress extends Progress {
  subjectName?: string;
  subjectCode?: string;
  subjectColor?: string | null;
  subjectIcon?: string | null;
}

export async function getUserProgress(userId: string): Promise<UserSubjectProgress[]> {
  const progressList = await db
    .select({
      id: progress.id,
      userId: progress.userId,
      subjectId: progress.subjectId,
      progress: progress.progress,
      lastAccessed: progress.lastAccessed,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
      deletedAt: progress.deletedAt,
      syncStatus: progress.syncStatus,
      subjectName: subjects.name,
      subjectCode: subjects.code,
      subjectColor: subjects.color,
      subjectIcon: subjects.icon,
    })
    .from(progress)
    .innerJoin(subjects, eq(progress.subjectId, subjects.id))
    .where(eq(progress.userId, userId));

  return progressList;
}

export async function updateSubjectProgress(
  userId: string,
  subjectId: string,
  progressValue: number,
): Promise<{ success: boolean }> {
  const now = new Date();
  const cappedValue = Math.min(100, Math.max(0, Math.round(progressValue)));

  const existing = await db
    .select()
    .from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.subjectId, subjectId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(progress)
      .set({
        progress: cappedValue,
        lastAccessed: now,
        updatedAt: now,
      })
      .where(eq(progress.id, existing[0].id));

    await enqueueOutboxMutation("progress", existing[0].id, "UPDATE", {
      progress: cappedValue,
      lastAccessed: now,
    });
  } else {
    const id = generateUUID();
    const newProgress = {
      id,
      userId,
      subjectId,
      progress: cappedValue,
      lastAccessed: now,
      syncStatus: "synced" as const,
    };
    await db.insert(progress).values(newProgress);
    await enqueueOutboxMutation("progress", id, "INSERT", newProgress);
  }

  return { success: true };
}
