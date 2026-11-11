import { eq, and, gte, lte, inArray, desc } from "drizzle-orm";
import { db } from "../db/client";
import { questions, generateUUID } from "../db/schema";
import type { Question, NewQuestion, BoardType, ExamType } from "../types";
import { selectRandomQuestions, selectRandomQuestionsStrict } from "../lib/algorithm/questionSelector";
import { enqueueOutboxMutation } from "./outbox.repository";

export interface QuestionQueryFilter {
  subjectName?: string;
  board?: BoardType;
  yearFrom?: number;
  yearTo?: number;
  limit?: number;
  topicId?: string;
  type?: ExamType;
}

export async function getQuestions(filter?: QuestionQueryFilter): Promise<Question[]> {
  const conditions = [];

  if (filter?.subjectName) {
    conditions.push(eq(questions.subjectName, filter.subjectName));
  }
  if (filter?.board) {
    conditions.push(eq(questions.board, filter.board));
  }
  if (filter?.yearFrom) {
    conditions.push(gte(questions.year, filter.yearFrom));
  }
  if (filter?.yearTo) {
    conditions.push(lte(questions.year, filter.yearTo));
  }
  if (filter?.topicId) {
    conditions.push(eq(questions.topicId, filter.topicId));
  }
  if (filter?.type) {
    conditions.push(eq(questions.type, filter.type));
  }

  const query = conditions.length > 0
    ? db.select().from(questions).where(and(...conditions))
    : db.select().from(questions);

  if (filter?.limit) {
    return query.limit(filter.limit);
  }

  return query;
}

export async function getQuestionsBySubject(
  subjectName: string,
  limit = 40,
): Promise<Question[]> {
  return db
    .select()
    .from(questions)
    .where(eq(questions.subjectName, subjectName))
    .limit(limit);
}

export async function getRandomQuestionsForSession(params: {
  subjectNames?: string[];
  board?: BoardType;
  yearFrom?: number;
  yearTo?: number;
  limit?: number;
  topicId?: string;
  mode?: string;
  topics?: Set<string>;
  subTopics?: Set<string>;
}): Promise<{ questions: Question[]; total: number; examType: ExamType }> {
  const conditions = [];

  if (params.subjectNames && params.subjectNames.length > 0) {
    conditions.push(inArray(questions.subjectName, params.subjectNames));
  }
  if (params.board) {
    conditions.push(eq(questions.board, params.board));
  }
  if (params.yearFrom) {
    conditions.push(gte(questions.year, params.yearFrom));
  }
  if (params.yearTo) {
    conditions.push(lte(questions.year, params.yearTo));
  }
  if (params.topicId) {
    conditions.push(eq(questions.topicId, params.topicId));
  }

  const allAvailable = conditions.length > 0
    ? await db.select().from(questions).where(and(...conditions))
    : await db.select().from(questions);

  const modeToExamTypeMap: Record<string, ExamType> = {
    mock_exam: "STANDARD",
    speed_test: "SPEED",
    topic_quiz: "KNOWLEDGE",
    weak_areas: "KNOWLEDGE",
    STANDARD: "STANDARD",
    SPEED: "SPEED",
    KNOWLEDGE: "KNOWLEDGE",
    AI_PREDICTED: "AI_PREDICTED",
  };
  const targetExamType: ExamType = modeToExamTypeMap[params.mode ?? "STANDARD"] || "STANDARD";

  let selected: Question[] = [];
  const count = params.limit ?? 40;

  if (params.topics || params.subTopics) {
    selected = selectRandomQuestionsStrict(allAvailable, {
      count,
      topics: params.topics,
      subTopics: params.subTopics,
      subject: params.subjectNames?.[0],
      ensureTopicDistribution: true,
      ensureSubtopicDistribution: true,
    }) as Question[];
  } else {
    selected = selectRandomQuestions(allAvailable, {
      count,
      subject: params.subjectNames?.[0],
      years: params.yearFrom && params.yearTo
        ? Array.from({ length: params.yearTo - params.yearFrom + 1 }, (_, i) => params.yearFrom! + i)
        : undefined,
    }) as Question[];
  }

  return {
    questions: selected,
    total: selected.length,
    examType: targetExamType,
  };
}

export async function getQuestionById(id: string): Promise<Question | null> {
  const results = await db.select().from(questions).where(eq(questions.id, id)).limit(1);
  return results[0] ?? null;
}

export async function createQuestion(data: NewQuestion): Promise<Question> {
  const id = data.id || generateUUID();
  const newRow: NewQuestion = { ...data, id };
  await db.insert(questions).values(newRow);
  await enqueueOutboxMutation("questions", id, "INSERT", newRow);
  const created = await getQuestionById(id);
  return created!;
}

export async function bulkCreateQuestions(questionsList: NewQuestion[]): Promise<number> {
  const rows = questionsList.map((q) => ({
    ...q,
    id: q.id || generateUUID(),
  }));
  await db.insert(questions).values(rows);
  for (const row of rows) {
    await enqueueOutboxMutation("questions", row.id, "INSERT", row);
  }
  return rows.length;
}
