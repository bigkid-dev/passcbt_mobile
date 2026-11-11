import { eq, asc, desc } from "drizzle-orm";
import { db } from "../db/client";
import {
  studyPlans,
  studyPlanItems,
  topics,
  subjects,
  generateUUID,
} from "../db/schema";
import type { StudyPlan, StudyPlanItem } from "../types";
import {
  StudyPlanGenerator,
  type StudyPlanConfig,
  type Syllabus as AlgSyllabus,
} from "../lib/algorithm/studyPlan";
import { enqueueOutboxMutation } from "./outbox.repository";

export interface StudyPlanWithItems extends StudyPlan {
  subjectName?: string;
  items: (StudyPlanItem & { topicTitle?: string })[];
}

export async function getStudyPlans(userId: string): Promise<StudyPlanWithItems[]> {
  const plans = await db
    .select({
      id: studyPlans.id,
      userId: studyPlans.userId,
      subjectId: studyPlans.subjectId,
      syllabusId: studyPlans.syllabusId,
      title: studyPlans.title,
      startDate: studyPlans.startDate,
      endDate: studyPlans.endDate,
      color: studyPlans.color,
      completed: studyPlans.completed,
      createdAt: studyPlans.createdAt,
      updatedAt: studyPlans.updatedAt,
      deletedAt: studyPlans.deletedAt,
      syncStatus: studyPlans.syncStatus,
      subjectName: subjects.name,
    })
    .from(studyPlans)
    .innerJoin(subjects, eq(studyPlans.subjectId, subjects.id))
    .where(eq(studyPlans.userId, userId))
    .orderBy(desc(studyPlans.createdAt));

  const result: StudyPlanWithItems[] = [];

  for (const plan of plans) {
    const items = await db
      .select({
        id: studyPlanItems.id,
        studyPlanId: studyPlanItems.studyPlanId,
        topicId: studyPlanItems.topicId,
        date: studyPlanItems.date,
        duration: studyPlanItems.duration,
        order: studyPlanItems.order,
        notes: studyPlanItems.notes,
        completed: studyPlanItems.completed,
        createdAt: studyPlanItems.createdAt,
        updatedAt: studyPlanItems.updatedAt,
        deletedAt: studyPlanItems.deletedAt,
        syncStatus: studyPlanItems.syncStatus,
        topicTitle: topics.title,
      })
      .from(studyPlanItems)
      .innerJoin(topics, eq(studyPlanItems.topicId, topics.id))
      .where(eq(studyPlanItems.studyPlanId, plan.id))
      .orderBy(asc(studyPlanItems.order));

    result.push({
      ...plan,
      items,
    });
  }

  return result;
}

export async function generateAndSaveStudyPlan(payload: {
  userId: string;
  syllabi: AlgSyllabus[];
  config: StudyPlanConfig;
}): Promise<StudyPlanWithItems[]> {
  const generatedPlans = await StudyPlanGenerator.generateMultiSubjectPlan(
    payload.syllabi,
    payload.userId,
    payload.config,
  );

  const createdPlans: StudyPlanWithItems[] = [];

  for (const genPlan of generatedPlans) {
    const planId = generateUUID();
    const newPlanRow = {
      id: planId,
      userId: payload.userId,
      subjectId: genPlan.subjectId,
      syllabusId: genPlan.syllabusId,
      title: genPlan.title,
      startDate: genPlan.startDate,
      endDate: genPlan.endDate,
      color: genPlan.color,
      completed: false,
      syncStatus: "synced" as const,
    };

    await db.insert(studyPlans).values(newPlanRow);
    await enqueueOutboxMutation("study_plans", planId, "INSERT", newPlanRow);

    const insertedItems: (StudyPlanItem & { topicTitle?: string })[] = [];

    for (const item of genPlan.items) {
      const itemId = generateUUID();
      const newItemRow = {
        id: itemId,
        studyPlanId: planId,
        topicId: item.topicId,
        date: item.date,
        duration: item.duration,
        order: item.order,
        notes: item.notes,
        completed: false,
        syncStatus: "synced" as const,
      };

      await db.insert(studyPlanItems).values(newItemRow);
      await enqueueOutboxMutation("study_plan_items", itemId, "INSERT", newItemRow);

      insertedItems.push({
        ...newItemRow,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
    }

    createdPlans.push({
      ...newPlanRow,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      items: insertedItems,
    });
  }

  return createdPlans;
}

export async function toggleStudyPlanItem(
  itemId: string,
  completed: boolean,
): Promise<{ success: boolean }> {
  const now = new Date();
  await db
    .update(studyPlanItems)
    .set({ completed, updatedAt: now })
    .where(eq(studyPlanItems.id, itemId));

  await enqueueOutboxMutation("study_plan_items", itemId, "UPDATE", { completed, updatedAt: now });

  return { success: true };
}

export async function deleteStudyPlan(planId: string): Promise<{ success: boolean }> {
  await db.delete(studyPlanItems).where(eq(studyPlanItems.studyPlanId, planId));
  await db.delete(studyPlans).where(eq(studyPlans.id, planId));
  await enqueueOutboxMutation("study_plans", planId, "DELETE", { planId });
  return { success: true };
}
