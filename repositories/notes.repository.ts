import { eq, asc } from "drizzle-orm";
import { db } from "../db/client";
import {
  noteContents,
  noteSubContents,
  topics,
  syllabi,
  subjects,
  generateUUID,
} from "../db/schema";
import type { ContentBlock } from "../lib/noteSchema";
import { transformNoteToBlocks } from "../lib/noteTransformer";
import { enqueueOutboxMutation } from "./outbox.repository";

export interface FormattedNote {
  topicId: string;
  subject: string;
  title: string;
  syllabusPosition: number;
  examBoards: string[];
  frequency: string;
  estimatedReadMinutes: number;
  content: ContentBlock[];
}

export async function getNoteByTopicId(topicId: string): Promise<FormattedNote | null> {
  const topicRows = await db
    .select({
      topicId: topics.id,
      topicTitle: topics.title,
      topicExplanation: topics.explanation,
      topicMemoryTrick: topics.memoryTrick,
      topicContent: topics.content,
      topicOrder: topics.order,
      syllabusTitle: syllabi.title,
      subjectName: subjects.name,
    })
    .from(topics)
    .innerJoin(syllabi, eq(topics.syllabusId, syllabi.id))
    .innerJoin(subjects, eq(syllabi.subjectId, subjects.id))
    .where(eq(topics.id, topicId))
    .limit(1);

  if (topicRows.length === 0) return null;
  const topicInfo = topicRows[0];

  const noteRows = await db
    .select()
    .from(noteContents)
    .where(eq(noteContents.topicId, topicId))
    .limit(1);

  if (noteRows.length > 0) {
    const rawNote = noteRows[0];
    const subContents = await db
      .select()
      .from(noteSubContents)
      .where(eq(noteSubContents.noteContentId, rawNote.id))
      .orderBy(asc(noteSubContents.order));

    const blocks = transformNoteToBlocks({
      id: rawNote.id,
      content: rawNote.content,
      summary: rawNote.summary,
      keyTerms: rawNote.keyTerms,
      examTips: rawNote.examTips,
      memoryTrick: rawNote.memoryTrick,
      html: rawNote.html,
      calculations: rawNote.calculations as any,
      subContent: subContents as any,
    });

    return {
      topicId,
      subject: topicInfo.subjectName,
      title: topicInfo.topicTitle,
      syllabusPosition: topicInfo.topicOrder ?? 1,
      examBoards: ["JAMB", "WAEC", "NECO"],
      frequency: "high",
      estimatedReadMinutes: Math.max(5, Math.ceil((rawNote.content.length || 500) / 1000)),
      content: blocks,
    };
  }

  const defaultContent = topicInfo.topicExplanation || topicInfo.topicContent || `Comprehensive study notes for ${topicInfo.topicTitle}. This topic covers essential concepts for JAMB, WAEC, and NECO examinations.`;
  const fallbackBlocks = transformNoteToBlocks({
    content: defaultContent,
    summary: `Key takeaways for ${topicInfo.topicTitle}.\n- Master foundational principles\n- Practice past exam questions\n- Review syllabus objectives`,
    examTips: `Pay close attention to definitions and formulas relating to ${topicInfo.topicTitle}.`,
    memoryTrick: topicInfo.topicMemoryTrick || "",
    keyTerms: [{ term: topicInfo.topicTitle, definition: `Primary subject matter for this unit.` }],
  });

  return {
    topicId,
    subject: topicInfo.subjectName,
    title: topicInfo.topicTitle,
    syllabusPosition: topicInfo.topicOrder ?? 1,
    examBoards: ["JAMB", "WAEC", "NECO"],
    frequency: "medium",
    estimatedReadMinutes: 8,
    content: fallbackBlocks,
  };
}

export async function saveNote(payload: {
  topicId: string;
  content: string;
  summary?: string;
  keyTerms?: Array<{ term: string; definition: string }>;
  examTips?: string;
  memoryTrick?: string;
  html?: string;
  calculations?: Array<{ question: string; solution: string; answer: string; year?: string }>;
}): Promise<void> {
  const existing = await db
    .select()
    .from(noteContents)
    .where(eq(noteContents.topicId, payload.topicId))
    .limit(1);

  const now = new Date();

  if (existing.length > 0) {
    await db
      .update(noteContents)
      .set({
        content: payload.content,
        summary: payload.summary || "",
        keyTerms: payload.keyTerms || [],
        examTips: payload.examTips || "",
        memoryTrick: payload.memoryTrick || "",
        html: payload.html || null,
        calculations: payload.calculations || null,
        updatedAt: now,
      })
      .where(eq(noteContents.id, existing[0].id));

    await enqueueOutboxMutation("note_contents", existing[0].id, "UPDATE", payload);
  } else {
    const id = generateUUID();
    const newNote = {
      id,
      topicId: payload.topicId,
      content: payload.content,
      summary: payload.summary || "",
      keyTerms: payload.keyTerms || [],
      examTips: payload.examTips || "",
      memoryTrick: payload.memoryTrick || "",
      html: payload.html || null,
      calculations: payload.calculations || null,
      syncStatus: "synced" as const,
    };
    await db.insert(noteContents).values(newNote);
    await enqueueOutboxMutation("note_contents", id, "INSERT", newNote);
  }
}
