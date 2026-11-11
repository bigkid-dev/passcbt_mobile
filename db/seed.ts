import { eq } from "drizzle-orm";
import { db } from "./client";
import {
  appSettings,
  subjects,
  syllabi,
  topics,
  questions,
  users,
  generateUUID,
} from "./schema";
import { subjectData } from "../lib/data";
import bundledQuestions from "../assets/seed/questions.json";

export interface SeedQuestion {
  text: string;
  options: string[];
  correctAnswer: number;
  topicName?: string | null;
  subTopic?: string | null;
  subjectName?: string | null;
  isCalc?: boolean;
  explanation?: string;
  fastestSolve?: string | null;
  tip?: string | null;
  type?: string;
  year?: number;
}

export async function seedDatabase(force = false): Promise<{ seeded: boolean; questionsCount: number }> {
  try {
    const existingSettings = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.id, "default"))
      .limit(1);

    if (!force && existingSettings.length > 0 && existingSettings[0].isSeeded) {
      return { seeded: false, questionsCount: 0 };
    }

    const defaultUserId = generateUUID();
    const existingUser = await db.select().from(users).limit(1);
    if (existingUser.length === 0) {
      await db.insert(users).values({
        id: defaultUserId,
        firstName: "Student",
        lastName: "User",
        email: "student@passcbt.local",
        hasOnboarded: false,
        totalStudyMinutes: 0,
        isSubscribed: false,
        syncStatus: "synced",
      });
    }

    const subjectMap = new Map<string, string>();
    for (const sub of subjectData) {
      const existing = await db
        .select()
        .from(subjects)
        .where(eq(subjects.code, sub.code))
        .limit(1);

      let subjectId: string;
      if (existing.length > 0) {
        subjectId = existing[0].id;
      } else {
        subjectId = generateUUID();
        await db.insert(subjects).values({
          id: subjectId,
          name: sub.name,
          code: sub.code,
          color: sub.color,
          icon: sub.icon,
          syncStatus: "synced",
        });
      }
      subjectMap.set(sub.name.toLowerCase(), subjectId);
      subjectMap.set(sub.code.toLowerCase(), subjectId);
    }

    const topicMap = new Map<string, string>();
    const rawQuestions = bundledQuestions as SeedQuestion[];
    for (const q of rawQuestions) {
      const topicName = q.topicName?.trim();
      const subjectName = q.subjectName?.trim();

      if (topicName && !topicMap.has(topicName.toLowerCase())) {
        const subjectId =
          (subjectName && subjectMap.get(subjectName.toLowerCase())) ||
          Array.from(subjectMap.values())[0];

        let syllabusId: string;
        const existingSyllabus = await db
          .select()
          .from(syllabi)
          .where(eq(syllabi.subjectId, subjectId))
          .limit(1);

        if (existingSyllabus.length > 0) {
          syllabusId = existingSyllabus[0].id;
        } else {
          syllabusId = generateUUID();
          await db.insert(syllabi).values({
            id: syllabusId,
            subjectId,
            title: `${subjectName || "Subject"} General Syllabus`,
            order: 1,
            syncStatus: "synced",
          });
        }

        const topicId = generateUUID();
        await db.insert(topics).values({
          id: topicId,
          syllabusId,
          title: topicName,
          order: 1,
          syncStatus: "synced",
        });
        topicMap.set(topicName.toLowerCase(), topicId);
      }
    }

    let insertedCount = 0;
    for (const q of rawQuestions) {
      const topicId = q.topicName ? topicMap.get(q.topicName.toLowerCase()) : null;
      await db.insert(questions).values({
        id: generateUUID(),
        text: q.text,
        options: q.options,
        correctAnswer: Number(q.correctAnswer ?? 0),
        instruction: "",
        explanation: q.explanation || "",
        fastestSolve: q.fastestSolve || null,
        tip: q.tip || null,
        type: (q.type as any) || "STANDARD",
        difficulty: "Easy",
        year: q.year ? Number(q.year) : 2024,
        subjectName: q.subjectName || null,
        topicName: q.topicName || null,
        subTopic: q.subTopic || null,
        board: "JAMB",
        isCalc: Boolean(q.isCalc),
        topicId: topicId || null,
        syncStatus: "synced",
      });
      insertedCount++;
    }

    if (existingSettings.length === 0) {
      await db.insert(appSettings).values({
        id: "default",
        theme: "dark",
        isSubscribed: false,
        isSeeded: true,
      });
    } else {
      await db
        .update(appSettings)
        .set({ isSeeded: true, updatedAt: new Date() })
        .where(eq(appSettings.id, "default"));
    }

    return { seeded: true, questionsCount: insertedCount };
  } catch (error) {
    console.error("Database seed error:", error);
    throw error;
  }
}
