import type { ContentBlock } from "./noteSchema";

interface RawKeyTerm {
  term?: string;
  word?: string;
  definition?: string;
  meaning?: string;
}

interface RawCalculation {
  question: string;
  solution: string;
  answer: string;
  year?: string;
  questionNumber?: string;
}

interface RawSubContent {
  id?: string;
  order?: number | null;
  content: string;
  summary?: string;
  keyTerms?: unknown;
  examTips?: string;
  memoryTrick?: string;
  html?: string | null;
  type?: string | null;
  calculations?: RawCalculation[];
}

interface RawNoteContent {
  id?: string;
  content: string;
  summary?: string;
  keyTerms?: unknown;
  examTips?: string;
  memoryTrick?: string;
  html?: string | null;
  calculations?: RawCalculation[];
  subContent?: RawSubContent[];
}

function parseKeyTerms(raw: unknown): RawKeyTerm[] {
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item: unknown) => {
      if (typeof item === "string") return { term: item, definition: "" };
      const o = item as Record<string, string>;
      return { term: o.term ?? o.word ?? "", definition: o.definition ?? o.meaning ?? "" };
    });
  } catch {
    return [];
  }
}

function parseExamTips(raw?: string): string[] {
  if (!raw || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {}
  return raw
    .split(/\n|\d+\.\s/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
}

function detectBoard(text: string): "JAMB" | "WAEC" | "NECO" | "GCE" {
  const upper = text.toUpperCase();
  if (upper.includes("WAEC")) return "WAEC";
  if (upper.includes("NECO")) return "NECO";
  if (upper.includes("GCE")) return "GCE";
  return "JAMB";
}

function extractHeading(content: string): string | null {
  const match = content.match(/^#{1,3}\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function hasMarkdownMath(text: string): boolean {
  return /\\\(|\\\[|\$\$/.test(text);
}

export function transformNoteToBlocks(note: RawNoteContent): ContentBlock[] {
  const blocks: ContentBlock[] = [];

  if (note.content?.trim()) {
    const heading = extractHeading(note.content);
    if (heading) {
      blocks.push({ type: "section_heading", data: { text: heading } });
    }
    blocks.push({
      type: "paragraph",
      data: {
        markdown: note.content.trim(),
        hasMath: hasMarkdownMath(note.content),
      },
    });
  }

  if (note.html?.trim()) {
    blocks.push({
      type: "diagram",
      data: {
        title: "Diagram",
        html: note.html,
        description: "",
      },
    });
  }

  const keyTerms = parseKeyTerms(note.keyTerms);
  if (keyTerms.length > 0) {
    blocks.push({ type: "section_heading", data: { text: "Key Terms" } });
    const items = keyTerms.slice(0, 8).map((kt) => ({
      iconName: "TargetIcon",
      title: kt.term ?? "",
      markdown: kt.definition ?? "",
    }));
    blocks.push({
      type: "fact_grid",
      data: { columns: 2, items },
    });
  }

  const sorted = [...(note.subContent || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  for (const sub of sorted) {
    if (sub.content?.trim()) {
      const heading = extractHeading(sub.content);
      if (heading) {
        blocks.push({ type: "section_heading", data: { text: heading } });
      }
      blocks.push({
        type: "paragraph",
        data: {
          markdown: sub.content.trim(),
          hasMath: hasMarkdownMath(sub.content),
        },
      });
    }

    if (sub.html?.trim()) {
      blocks.push({
        type: "diagram",
        data: {
          title: "Diagram",
          html: sub.html,
          description: "",
        },
      });
    }

    const subTerms = parseKeyTerms(sub.keyTerms);
    if (subTerms.length > 0) {
      const items = subTerms.slice(0, 4).map((kt) => ({
        iconName: "TargetIcon",
        title: kt.term ?? "",
        markdown: kt.definition ?? "",
      }));
      blocks.push({ type: "fact_grid", data: { columns: 2, items } });
    }

    const subTips = parseExamTips(sub.examTips);
    for (const tip of subTips.slice(0, 2)) {
      blocks.push({
        type: "exam_tip",
        data: { board: detectBoard(tip), markdown: tip },
      });
    }

    if (sub.memoryTrick?.trim()) {
      blocks.push({
        type: "example",
        data: { markdown: sub.memoryTrick.trim() },
      });
    }

    if (sub.calculations?.length) {
      for (const calc of sub.calculations.slice(0, 3)) {
        blocks.push({
          type: "calculation",
          data: {
            question: calc.question,
            solution: calc.solution,
            answer: calc.answer,
            year: calc.year ?? null,
            hasMath: hasMarkdownMath(calc.solution) || hasMarkdownMath(calc.question),
          },
        });
      }
    }
  }

  const tips = parseExamTips(note.examTips);
  if (tips.length > 0) {
    blocks.push({ type: "section_heading", data: { text: "Exam Tips" } });
    for (const tip of tips.slice(0, 4)) {
      blocks.push({
        type: "exam_tip",
        data: { board: detectBoard(tip), markdown: tip },
      });
    }
  }

  if (note.memoryTrick?.trim()) {
    blocks.push({
      type: "example",
      data: { markdown: note.memoryTrick.trim() },
    });
  }

  if (note.calculations?.length) {
    blocks.push({ type: "section_heading", data: { text: "Practice Calculations" } });
    for (const calc of note.calculations.slice(0, 5)) {
      blocks.push({
        type: "calculation",
        data: {
          question: calc.question,
          solution: calc.solution,
          answer: calc.answer,
          year: calc.year ?? null,
          hasMath: hasMarkdownMath(calc.solution) || hasMarkdownMath(calc.question),
        },
      });
    }
  }

  if (note.summary?.trim()) {
    const items = note.summary
      .split(/\n/)
      .map((s) => s.replace(/^[-•*]\s*/, "").trim())
      .filter((s) => s.length > 4);
    if (items.length > 0) {
      blocks.push({ type: "summary", data: { items } });
    }
  }

  return blocks;
}
