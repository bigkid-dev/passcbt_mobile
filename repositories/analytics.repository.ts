import { eq, and, desc } from "drizzle-orm";
import { db } from "../db/client";
import {
  users,
  exams,
  progress,
  subjects,
  topicsCompleted,
} from "../db/schema";
import { enqueueOutboxMutation } from "./outbox.repository";

export interface WeekActivityDay {
  date: string;
  questionsAnswered: number;
  averageScore: number;
  xpEarned: number;
}

export interface SubjectPerformanceItem {
  subjectId: string;
  subjectName: string;
  averageScore: number;
  completedTopics: number;
}

export interface OverallAnalyticsData {
  overall: {
    averageScore: number;
    totalExams: number;
    topicsCompleted: number;
    studyTimeMinutes: number;
  };
  weekActivity: WeekActivityDay[];
  subjectPerformance: SubjectPerformanceItem[];
}

export async function getOverallAnalytics(userId: string): Promise<OverallAnalyticsData> {
  const userRows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const user = userRows[0];
  const studyMinutes = user?.totalStudyMinutes ?? 0;

  const completedExams = await db
    .select()
    .from(exams)
    .where(and(eq(exams.userId, userId), eq(exams.isCompleted, true)))
    .orderBy(desc(exams.createdAt));

  const scores = completedExams.map((e) => e.score);
  const averageScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  const completedTopicsList = await db
    .select()
    .from(topicsCompleted)
    .where(and(eq(topicsCompleted.userId, userId), eq(topicsCompleted.isComplete, true)));

  const today = new Date();
  const weekActivity: WeekActivityDay[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    const dateStr = date.toISOString().split("T")[0];

    const dayExams = completedExams.filter((e) => {
      const d = new Date(e.createdAt);
      return d.toDateString() === date.toDateString();
    });

    const dayScores = dayExams.map((e) => e.score);
    const dayAvg = dayScores.length > 0
      ? Math.round(dayScores.reduce((a, b) => a + b, 0) / dayScores.length)
      : 0;

    return {
      date: dateStr,
      questionsAnswered: dayExams.reduce((acc, e) => acc + (e.totalQuestion || 0), 0),
      averageScore: dayAvg,
      xpEarned: dayExams.reduce((acc, e) => acc + (e.score || 0), 0),
    };
  });

  const progressRows = await db
    .select({
      subjectId: progress.subjectId,
      progressValue: progress.progress,
      subjectName: subjects.name,
    })
    .from(progress)
    .innerJoin(subjects, eq(progress.subjectId, subjects.id))
    .where(eq(progress.userId, userId));

  const subjectPerformance: SubjectPerformanceItem[] = progressRows.map((p) => ({
    subjectId: p.subjectId,
    subjectName: p.subjectName,
    averageScore: p.progressValue,
    completedTopics: completedTopicsList.filter((t) => t.subjectId === p.subjectId).length,
  }));

  return {
    overall: {
      averageScore,
      totalExams: completedExams.length,
      topicsCompleted: completedTopicsList.length,
      studyTimeMinutes: studyMinutes,
    },
    weekActivity,
    subjectPerformance,
  };
}

export async function recordStudyMinutes(
  userId: string,
  minutes: number,
): Promise<{ success: boolean }> {
  const cappedMinutes = Math.min(minutes, 480);
  const now = new Date();

  const userRows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (userRows.length > 0) {
    const currentMinutes = userRows[0].totalStudyMinutes || 0;
    await db
      .update(users)
      .set({
        totalStudyMinutes: currentMinutes + cappedMinutes,
        lastActiveAt: now,
        updatedAt: now,
      })
      .where(eq(users.id, userId));

    await enqueueOutboxMutation("users", userId, "UPDATE", {
      totalStudyMinutes: currentMinutes + cappedMinutes,
      lastActiveAt: now,
    });
  }

  return { success: true };
}
