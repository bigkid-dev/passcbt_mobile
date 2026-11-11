export interface Topic {
  id: string;
  title: string;
  order: number | null;
  content?: string;
  explanation?: string;
  memoryTrick?: string;
}

export interface Syllabus {
  id: string;
  title: string;
  topics: Topic[];
  subjectId: string;
}

export interface StudyPlanConfig {
  startDate: Date;
  hoursPerDay: number;
  daysPerWeek: number[];
  includeWeekends: boolean;
  difficultyLevel: "easy" | "medium" | "hard";
  preferredStudyTime: "morning" | "afternoon" | "evening";
}

export interface GeneratedStudyPlanItem {
  topicId: string;
  date: Date;
  duration: number;
  order: number;
  notes: string;
}

export interface GeneratedStudyPlan {
  title: string;
  startDate: Date;
  endDate: Date;
  subjectId: string;
  syllabusId: string;
  userId: string;
  color: string;
  items: GeneratedStudyPlanItem[];
}

export class StudyPlanGenerator {
  static async generateMultiSubjectPlan(
    syllabuses: Syllabus[],
    userId: string,
    config: StudyPlanConfig,
  ): Promise<GeneratedStudyPlan[]> {
    const studyPlans: GeneratedStudyPlan[] = [];

    for (const syllabus of syllabuses) {
      const studyPlan = await this.generateStudyPlan(syllabus, userId, config);
      studyPlans.push(studyPlan);
    }

    return studyPlans;
  }

  static async generateStudyPlan(
    syllabus: Syllabus,
    userId: string,
    config: StudyPlanConfig,
  ): Promise<GeneratedStudyPlan> {
    const {
      startDate,
      hoursPerDay,
      daysPerWeek,
      includeWeekends,
      difficultyLevel,
    } = config;
    const topics = [...syllabus.topics].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const topicsPerDay = this.calculateTopicsPerDay(
      topics.length,
      difficultyLevel,
    );

    const studyDates = this.generateStudyDates(
      startDate,
      30,
      daysPerWeek,
      includeWeekends,
    );

    const studyPlanItems = this.distributeTopics(
      topics,
      studyDates,
      topicsPerDay,
      hoursPerDay,
    );

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);

    return {
      title: `${syllabus.title} - 30-Day Study Plan`,
      startDate,
      endDate,
      subjectId: syllabus.subjectId,
      syllabusId: syllabus.id,
      userId,
      color: this.getSubjectColor(syllabus.title),
      items: studyPlanItems,
    };
  }

  private static calculateTopicsPerDay(
    totalTopics: number,
    difficultyLevel: "easy" | "medium" | "hard",
  ): number {
    const days = 22;

    switch (difficultyLevel) {
      case "easy":
        return Math.max(1, Math.ceil(totalTopics / days));
      case "medium":
        return Math.max(1, Math.ceil((totalTopics * 1.2) / days));
      case "hard":
        return Math.max(1, Math.ceil((totalTopics * 1.5) / days));
      default:
        return Math.max(1, Math.ceil(totalTopics / days));
    }
  }

  private static generateStudyDates(
    startDate: Date,
    totalDays: number,
    daysPerWeek: number[],
    includeWeekends: boolean,
  ): Date[] {
    const studyDates: Date[] = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < totalDays; i++) {
      const dayOfWeek = currentDate.getDay();

      const shouldInclude =
        (includeWeekends || (dayOfWeek !== 0 && dayOfWeek !== 6)) &&
        daysPerWeek.includes(dayOfWeek);

      if (shouldInclude) {
        studyDates.push(new Date(currentDate));
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return studyDates;
  }

  private static distributeTopics(
    topics: Topic[],
    studyDates: Date[],
    topicsPerDay: number,
    hoursPerDay: number,
  ): GeneratedStudyPlanItem[] {
    const studyPlanItems: GeneratedStudyPlanItem[] = [];
    let topicIndex = 0;

    for (let i = 0; i < studyDates.length && topicIndex < topics.length; i++) {
      const date = studyDates[i];
      const dayTopics = topics.slice(topicIndex, topicIndex + topicsPerDay);
      topicIndex += topicsPerDay;

      dayTopics.forEach((topic, topicOrder) => {
        studyPlanItems.push({
          topicId: topic.id,
          date: new Date(date),
          duration: Math.floor((hoursPerDay * 60) / (dayTopics.length || 1)),
          order: topicOrder + 1,
          notes: `Study ${topic.title}`,
        });
      });
    }

    return studyPlanItems;
  }

  private static getSubjectColor(subjectTitle: string): string {
    const colors: Record<string, string> = {
      CRS: "#EF4444",
      Chemistry: "#10B981",
      Math: "#3B82F6",
      Physics: "#8B5CF6",
      Biology: "#F59E0B",
      English: "#EC4899",
      Commerce: "#FF6B6B",
      Economics: "#9C27B0",
      Government: "#2196F3",
      Geography: "#00BCD4",
      default: "#6B7280",
    };

    for (const [key, color] of Object.entries(colors)) {
      if (subjectTitle.toLowerCase().includes(key.toLowerCase())) {
        return color;
      }
    }

    return colors.default;
  }
}
