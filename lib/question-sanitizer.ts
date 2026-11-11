import { z } from "zod";

export const QuestionOptionSchema = z.union([
  z.string().min(1),
  z.object({ text: z.string().min(1) }),
]);

export const RawQuestionSchema = z.object({
  text: z.string().min(3, "Question text too short"),
  options: z
    .array(z.unknown())
    .min(2, "At least 2 options required")
    .max(6, "Max 6 options"),
  correctAnswer: z.union([z.number().int().min(0), z.string()]),
  instruction: z.string().optional().default(""),
  explanation: z.string().optional().default(""),
  fastestSolve: z.string().nullable().optional().default(null),
  type: z
    .enum(["STANDARD", "AI_PREDICTED", "SIMULATION", "KNOWLEDGE", "SPEED"])
    .optional()
    .default("STANDARD"),
  topicId: z.string().nullable().optional().default(null),
  topicName: z.string().nullable().optional().default(null),
  board: z
    .enum(["JAMB", "WAEC", "NECO", "GCE", "POST_UTME"])
    .optional()
    .default("JAMB"),
  subTopic: z.string().optional().default(""),
  tip: z.string().nullable().optional().default(null),
  subjectName: z.string().nullable().optional(),
  year: z.union([z.number().int(), z.string(), z.null()]).optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional().default("Easy"),
  html: z.string().optional().default(""),
  examId: z.string().nullable().optional().default(null),
  isCalc: z.boolean().optional().default(false),
});

export const BulkQuestionSchema = z.object({
  questions: z
    .array(RawQuestionSchema)
    .min(1, "At least one question is required")
    .max(500, "Maximum 500 questions per upload"),
});

export type RawQuestion = z.infer<typeof RawQuestionSchema>;

function normalizeOptions(raw: unknown[]): string[] {
  return raw.map((opt) => {
    if (typeof opt === "string") return opt.trim();
    if (typeof opt === "object" && opt !== null && "text" in opt) {
      return String((opt as { text: unknown }).text).trim();
    }
    return String(opt).trim();
  });
}

function normalizeCorrectAnswer(raw: unknown, optionsLen: number): number {
  const n = Number(raw);
  if (!isNaN(n) && n >= 0 && n < optionsLen) return Math.floor(n);
  if (typeof raw === "string") {
    const idx = ["A", "B", "C", "D", "E", "F"].indexOf(raw.trim().toUpperCase());
    if (idx >= 0 && idx < optionsLen) return idx;
  }
  return 0;
}

function normalizeYearNumber(raw: unknown): number {
  if (!raw) return 2024;
  if (raw instanceof Date) return raw.getFullYear();
  const str = String(raw).trim();
  const num = parseInt(str, 10);
  if (!isNaN(num) && num > 1900 && num < 2100) {
    return num;
  }
  return 2024;
}

export function sanitizeQuestion(q: RawQuestion) {
  const options = normalizeOptions(q.options as unknown[]);
  const correctAnswer = normalizeCorrectAnswer(q.correctAnswer, options.length);

  return {
    text: q.text.trim(),
    options,
    correctAnswer,
    instruction: (q.instruction ?? "").trim(),
    explanation: (q.explanation ?? "").trim(),
    fastestSolve: q.fastestSolve ? q.fastestSolve.trim() : null,
    type: q.type ?? "STANDARD",
    topicId: q.topicId ?? null,
    topicName: q.topicName ?? null,
    subTopic: (q.subTopic ?? "").trim(),
    tip: q.tip ?? null,
    subjectName: q.subjectName ? q.subjectName.trim() : null,
    year: normalizeYearNumber(q.year),
    difficulty: q.difficulty ?? "Easy",
    html: (q.html ?? "").trim(),
    examId: q.examId ?? null,
    board: q.board ?? "JAMB",
    isCalc: Boolean(q.isCalc),
  };
}

export function sanitizeBatch(raw: unknown): {
  ok: boolean;
  data?: ReturnType<typeof sanitizeQuestion>[];
  error?: string;
  issues?: z.ZodIssue[];
} {
  const parsed = BulkQuestionSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Validation failed", issues: parsed.error.issues };
  }
  return {
    ok: true,
    data: parsed.data.questions.map(sanitizeQuestion),
  };
}
