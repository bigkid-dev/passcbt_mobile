import { z } from "zod";

export const BoardSchema = z.enum(["JAMB", "WAEC", "NECO", "GCE", "POST_UTME"]);
export type Board = z.infer<typeof BoardSchema>;

export const ParagraphBlockSchema = z.object({
  type: z.literal("paragraph"),
  data: z.object({
    markdown: z.string(),
    hasMath: z.boolean().optional().default(false),
  }),
});

export const SectionHeadingBlockSchema = z.object({
  type: z.literal("section_heading"),
  data: z.object({ text: z.string() }),
});

export const DefinitionBlockSchema = z.object({
  type: z.literal("definition"),
  data: z.object({ term: z.string(), markdown: z.string() }),
});

export const FactGridItemSchema = z.object({
  iconName: z.string().optional(),
  title: z.string(),
  markdown: z.string(),
});

export const FactGridBlockSchema = z.object({
  type: z.literal("fact_grid"),
  data: z.object({
    columns: z.number().int().min(1).max(3).default(2),
    items: z.array(FactGridItemSchema),
  }),
});

export const DiagramBlockSchema = z.object({
  type: z.literal("diagram"),
  data: z.object({
    title: z.string(),
    description: z.string().optional().default(""),
    html: z.string().optional().default(""),
    caption: z.string().optional(),
    assetKey: z.string().optional(),
  }),
});

export const ImageBlockSchema = z.object({
  type: z.literal("image"),
  data: z.object({
    url: z.string(),
    localPath: z.string().nullable().optional(),
    alt: z.string(),
    caption: z.string().optional(),
    width: z.number().int().optional(),
    height: z.number().int().optional(),
  }),
});

export const ExampleBlockSchema = z.object({
  type: z.literal("example"),
  data: z.object({ markdown: z.string() }),
});

export const ExamTipBlockSchema = z.object({
  type: z.literal("exam_tip"),
  data: z.object({
    board: BoardSchema,
    markdown: z.string(),
  }),
});

export const SummaryBlockSchema = z.object({
  type: z.literal("summary"),
  data: z.object({ items: z.array(z.string()) }),
});

export const CalculationBlockSchema = z.object({
  type: z.literal("calculation"),
  data: z.object({
    question: z.string(),
    solution: z.string(),
    answer: z.string(),
    year: z.string().nullable().optional(),
    hasMath: z.boolean().optional().default(true),
  }),
});

export const ContentBlockSchema = z.discriminatedUnion("type", [
  ParagraphBlockSchema,
  SectionHeadingBlockSchema,
  DefinitionBlockSchema,
  FactGridBlockSchema,
  DiagramBlockSchema,
  ImageBlockSchema,
  ExampleBlockSchema,
  ExamTipBlockSchema,
  SummaryBlockSchema,
  CalculationBlockSchema,
]);

export type ContentBlock = z.infer<typeof ContentBlockSchema>;

export const NoteSchema = z.object({
  topicId: z.string(),
  subject: z.string(),
  title: z.string(),
  syllabusPosition: z.number().int().optional(),
  examBoards: z.array(BoardSchema),
  frequency: z.enum(["low", "medium", "high"]).default("medium"),
  estimatedReadMinutes: z.number().int().default(8),
  content: z.array(ContentBlockSchema),
});

export type Note = z.infer<typeof NoteSchema>;
