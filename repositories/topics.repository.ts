import { eq, and, asc } from "drizzle-orm";
import { db } from "../db/client";
import {
  subjects,
  userSubjects,
  syllabi,
  topics,
  topicsCompleted,
  generateUUID,
} from "../db/schema";
import type { Subject, Topic, TopicCompleted } from "../types";
import { enqueueOutboxMutation } from "./outbox.repository";
import { syllabusList } from "../lib/data";

export interface SubjectWithEnrollment extends Subject {
  isEnrolled: boolean;
  completedTopicsCount: number;
}

export interface TopicWithStatus extends Topic {
  syllabusTitle: string;
  isComplete: boolean;
  lastViewed: Date | null;
}

export async function getAllSubjects(): Promise<Subject[]> {
  return db.select().from(subjects).orderBy(asc(subjects.name));
}

export async function getEnrolledSubjects(userId: string): Promise<Subject[]> {
  const enrolled = await db
    .select({
      id: subjects.id,
      name: subjects.name,
      code: subjects.code,
      color: subjects.color,
      icon: subjects.icon,
      createdAt: subjects.createdAt,
      updatedAt: subjects.updatedAt,
      deletedAt: subjects.deletedAt,
      syncStatus: subjects.syncStatus,
    })
    .from(userSubjects)
    .innerJoin(subjects, eq(userSubjects.subjectId, subjects.id))
    .where(eq(userSubjects.userId, userId));

  if (enrolled.length === 0) {
    return getAllSubjects();
  }

  return enrolled;
}

export async function enrollSubject(userId: string, subjectId: string): Promise<void> {
  const existing = await db
    .select()
    .from(userSubjects)
    .where(and(eq(userSubjects.userId, userId), eq(userSubjects.subjectId, subjectId)))
    .limit(1);

  if (existing.length === 0) {
    const id = generateUUID();
    const newEnrollment = {
      id,
      userId,
      subjectId,
      syncStatus: "synced" as const,
    };
    await db.insert(userSubjects).values(newEnrollment);
    await enqueueOutboxMutation("user_subjects", id, "INSERT", newEnrollment);
  }
}

export async function unenrollSubject(userId: string, subjectId: string): Promise<void> {
  await db
    .delete(userSubjects)
    .where(and(eq(userSubjects.userId, userId), eq(userSubjects.subjectId, subjectId)));
  await enqueueOutboxMutation("user_subjects", `${userId}_${subjectId}`, "DELETE", { userId, subjectId });
}

export async function getTopicsBySubject(
  subjectId: string,
  userId?: string,
): Promise<TopicWithStatus[]> {
  let subjectSyllabi = await db
    .select()
    .from(syllabi)
    .where(eq(syllabi.subjectId, subjectId))
    .orderBy(asc(syllabi.order));

  if (subjectSyllabi.length === 0) {
    const subRows = await db.select().from(subjects).where(eq(subjects.id, subjectId)).limit(1);
    if (subRows.length > 0) {
      const sub = subRows[0];
      const sId = generateUUID();
      await db.insert(syllabi).values({
        id: sId,
        subjectId,
        title: `${sub.name} Syllabus`,
        order: 1,
        syncStatus: "synced",
      });

      const code = sub.code.toUpperCase();
      const rawList = (syllabusList as Record<string, any[]>)[code] || [];
      const topicsToInsert = rawList.length > 0
        ? rawList.map((item: any, idx: number) => ({
            id: generateUUID(),
            syllabusId: sId,
            title: item.Topic,
            order: idx + 1,
            explanation: `Core study concepts and exam guidelines for ${item.Topic}.`,
            syncStatus: "synced" as const,
          }))
        : Array.from({ length: 15 }, (_, i) => ({
            id: generateUUID(),
            syllabusId: sId,
            title: `${sub.name} Topic ${i + 1}`,
            order: i + 1,
            explanation: `Exam preparation notes for ${sub.name} topic ${i + 1}.`,
            syncStatus: "synced" as const,
          }));

      await db.insert(topics).values(topicsToInsert);

      subjectSyllabi = await db
        .select()
        .from(syllabi)
        .where(eq(syllabi.subjectId, subjectId))
        .orderBy(asc(syllabi.order));
    }
  }

  if (subjectSyllabi.length === 0) return [];

  const syllabusIds = subjectSyllabi.map((s) => s.id);
  const syllabusMap = new Map(subjectSyllabi.map((s) => [s.id, s.title]));

  const allTopics: TopicWithStatus[] = [];

  for (const sId of syllabusIds) {
    const topicRows = await db
      .select()
      .from(topics)
      .where(eq(topics.syllabusId, sId))
      .orderBy(asc(topics.order));

    for (const t of topicRows) {
      let isComplete = false;
      let lastViewed: Date | null = null;

      if (userId) {
        const comp = await db
          .select()
          .from(topicsCompleted)
          .where(and(eq(topicsCompleted.userId, userId), eq(topicsCompleted.topicId, t.id)))
          .limit(1);

        if (comp.length > 0) {
          isComplete = comp[0].isComplete;
          lastViewed = comp[0].lastViewed;
        }
      }

      allTopics.push({
        ...t,
        syllabusTitle: syllabusMap.get(t.syllabusId) || "General",
        isComplete,
        lastViewed,
      });
    }
  }

  return allTopics;
}

export async function setTopicCompletion(payload: {
  userId: string;
  topicId: string;
  subjectId?: string;
  isComplete: boolean;
}): Promise<{ success: boolean }> {
  const now = new Date();

  const existing = await db
    .select()
    .from(topicsCompleted)
    .where(and(eq(topicsCompleted.userId, payload.userId), eq(topicsCompleted.topicId, payload.topicId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(topicsCompleted)
      .set({
        isComplete: payload.isComplete,
        completedAt: payload.isComplete ? now : null,
        lastViewed: now,
        updatedAt: now,
      })
      .where(eq(topicsCompleted.id, existing[0].id));

    await enqueueOutboxMutation("topics_completed", existing[0].id, "UPDATE", {
      isComplete: payload.isComplete,
      lastViewed: now,
    });
  } else {
    const id = generateUUID();
    const newRecord = {
      id,
      userId: payload.userId,
      topicId: payload.topicId,
      subjectId: payload.subjectId || null,
      isComplete: payload.isComplete,
      completedAt: payload.isComplete ? now : null,
      lastViewed: now,
      syncStatus: "synced" as const,
    };
    await db.insert(topicsCompleted).values(newRecord);
    await enqueueOutboxMutation("topics_completed", id, "INSERT", newRecord);
  }

  return { success: true };
}

export async function getCompletedTopics(userId: string): Promise<TopicCompleted[]> {
  return db
    .select()
    .from(topicsCompleted)
    .where(and(eq(topicsCompleted.userId, userId), eq(topicsCompleted.isComplete, true)));
}
