export interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
  instruction?: string;
  explanation?: string;
  fastestSolve?: string | null;
  tip?: string | null;
  type?: string;
  year?: number | string | null;
  examId?: string | null;
  topicId?: string | null;
  topicName?: string | null;
  subTopic?: string | null;
  subjectName?: string | null;
  html?: string | null;
  isCalc?: boolean;
}

export interface SyllabusItem {
  Topic: string;
  subTopic: string[];
}

export interface QuestionFilter {
  count: number;
  syllabus?: SyllabusItem[];
  subject?: string;
  years?: number[];
}

export interface QuestionFilterV2 {
  count: number;
  topics?: Set<string>;
  subTopics?: Set<string>;
  subject?: string;
  years?: number[];
  ensureTopicDistribution?: boolean;
  ensureSubtopicDistribution?: boolean;
}

export function selectRandomQuestions(
  allQuestions: Question[],
  filter: QuestionFilter,
): Question[] {
  if (allQuestions.length === 0) {
    return [];
  }

  let filteredQuestions = allQuestions;
  if (filter.subject) {
    filteredQuestions = filteredQuestions.filter(
      (q) => (q.subjectName || "").toLowerCase() === filter.subject!.toLowerCase(),
    );
  }

  if (filter.syllabus && filter.syllabus.length > 0) {
    const syllabusSubtopics = new Set<string>();

    filter.syllabus.forEach((item) => {
      item.subTopic.forEach((subTopic) => {
        syllabusSubtopics.add(normalizeString(subTopic));
      });
    });

    filteredQuestions = filteredQuestions.filter((question) => {
      return syllabusSubtopics.has(normalizeString(question.subTopic || ""));
    });
  }

  if (filter.years && filter.years.length > 0) {
    filteredQuestions = filteredQuestions.filter((q) =>
      filter.years!.includes(Number(q.year)),
    );
  }

  const uniqueQuestions = new Map<string, Question>();

  filteredQuestions.forEach((question) => {
    const uniqueKey = generateQuestionId(question);
    if (!uniqueQuestions.has(uniqueKey)) {
      uniqueQuestions.set(uniqueKey, question);
    }
  });

  filteredQuestions = Array.from(uniqueQuestions.values());

  if (filteredQuestions.length === 0) {
    return [];
  }

  if (filteredQuestions.length <= filter.count) {
    return shuffleArray([...filteredQuestions]);
  }

  return getRandomQuestionsWithDistribution(
    [...filteredQuestions],
    filter.count,
  );
}

function getRandomQuestionsWithDistribution(
  questions: Question[],
  count: number,
): Question[] {
  const questionsBySubTopic = new Map<string, Question[]>();

  questions.forEach((question) => {
    const key = normalizeString(question.subTopic || "");
    if (!questionsBySubTopic.has(key)) {
      questionsBySubTopic.set(key, []);
    }
    questionsBySubTopic.get(key)!.push(question);
  });

  const selectedQuestions: Question[] = [];
  const usedQuestionIds = new Set<string>();
  const usedQuestionTexts = new Set<string>();

  const subTopicsArray = Array.from(questionsBySubTopic.keys());

  for (const subTopic of subTopicsArray) {
    if (selectedQuestions.length >= count) break;

    const availableQuestions = questionsBySubTopic
      .get(subTopic)!
      .filter((q) => {
        const id = generateQuestionId(q);
        const text = normalizeString(q.text);
        return !usedQuestionIds.has(id) && !usedQuestionTexts.has(text);
      });

    if (availableQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const randomQuestion = availableQuestions[randomIndex];
      selectedQuestions.push(randomQuestion);
      usedQuestionIds.add(generateQuestionId(randomQuestion));
      usedQuestionTexts.add(normalizeString(randomQuestion.text));
    }
  }

  const remainingQuestions = questions.filter((q) => {
    const id = generateQuestionId(q);
    const text = normalizeString(q.text);
    return !usedQuestionIds.has(id) && !usedQuestionTexts.has(text);
  });

  const shuffledRemaining = shuffleArray([...remainingQuestions]);
  const neededCount = count - selectedQuestions.length;
  const additionalQuestions = shuffledRemaining.slice(0, neededCount);

  selectedQuestions.push(...additionalQuestions);

  return shuffleArray(selectedQuestions);
}

export function generateQuestionId(question: Question): string {
  return `${normalizeString(question.text)}_${question.year}_${normalizeString(question.subTopic || "")}`;
}

export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function selectRandomQuestionsV2(
  allQuestions: Question[],
  filter: QuestionFilterV2,
): Question[] {
  if (allQuestions.length === 0) {
    return [];
  }

  let filteredQuestions = allQuestions;
  if (filter.subject) {
    filteredQuestions = filteredQuestions.filter(
      (q) => (q.subjectName || "").toLowerCase() === filter.subject!.toLowerCase(),
    );
  }

  if (
    (filter.topics && filter.topics.size > 0) ||
    (filter.subTopics && filter.subTopics.size > 0)
  ) {
    filteredQuestions = filteredQuestions.filter((question) => {
      const normalizedTopic = normalizeString(question.topicName || "");
      const normalizedSubTopic = normalizeString(question.subTopic || "");

      const matchesTopic =
        filter.topics?.size === 0 ||
        Array.from(filter.topics || []).some(
          (topic) => normalizeString(topic) === normalizedTopic,
        );

      const matchesSubTopic =
        filter.subTopics?.size === 0 ||
        Array.from(filter.subTopics || []).some(
          (subTopic) => normalizeString(subTopic) === normalizedSubTopic,
        );

      return matchesTopic || matchesSubTopic;
    });
  }

  if (filter.years && filter.years.length > 0) {
    filteredQuestions = filteredQuestions.filter((q) =>
      filter.years!.includes(Number(q.year)),
    );
  }

  const uniqueQuestions = new Map<string, Question>();

  filteredQuestions.forEach((question) => {
    const uniqueKey = `${normalizeString(question.text)}_${question.year}_${normalizeString(question.subTopic || "")}`;
    if (!uniqueQuestions.has(uniqueKey)) {
      uniqueQuestions.set(uniqueKey, question);
    }
  });

  filteredQuestions = Array.from(uniqueQuestions.values());

  if (filteredQuestions.length === 0) {
    return [];
  }

  if (filteredQuestions.length <= filter.count) {
    return shuffleArray([...filteredQuestions]);
  }

  if (filter.ensureTopicDistribution && filter.ensureSubtopicDistribution) {
    return getRandomQuestionsWithTopicAndSubtopicDistribution(
      filteredQuestions,
      filter.count,
      filter.topics || new Set(),
      filter.subTopics || new Set(),
    );
  } else if (filter.ensureTopicDistribution) {
    return getRandomQuestionsWithTopicDistribution(
      filteredQuestions,
      filter.count,
      filter.topics || new Set(),
    );
  } else if (filter.ensureSubtopicDistribution) {
    return getRandomQuestionsWithSubtopicDistribution(
      filteredQuestions,
      filter.count,
      filter.subTopics || new Set(),
    );
  } else {
    return getRandomQuestionsSimple(filteredQuestions, filter.count);
  }
}

function getRandomQuestionsWithTopicDistribution(
  questions: Question[],
  count: number,
  topics: Set<string>,
): Question[] {
  const questionsByTopic = new Map<string, Question[]>();

  questions.forEach((question) => {
    const key = normalizeString(question.topicName || "");
    if (!questionsByTopic.has(key)) {
      questionsByTopic.set(key, []);
    }
    questionsByTopic.get(key)!.push(question);
  });

  const selectedQuestions: Question[] = [];
  const usedQuestionIds = new Set<string>();
  const usedTexts = new Set<string>();

  const topicsArray = Array.from(questionsByTopic.keys());
  shuffleArray(topicsArray);

  for (const topic of topicsArray) {
    if (selectedQuestions.length >= count) break;

    const availableQuestions = questionsByTopic.get(topic)!.filter((q) => {
      const id = generateQuestionId(q);
      const text = normalizeString(q.text);
      return !usedQuestionIds.has(id) && !usedTexts.has(text);
    });

    if (availableQuestions.length > 0) {
      const randomQuestion =
        availableQuestions[
          Math.floor(Math.random() * availableQuestions.length)
        ];
      selectedQuestions.push(randomQuestion);
      usedQuestionIds.add(generateQuestionId(randomQuestion));
      usedTexts.add(normalizeString(randomQuestion.text));
    }
  }

  const remainingQuestions = questions.filter((q) => {
    const id = generateQuestionId(q);
    const text = normalizeString(q.text);
    return !usedQuestionIds.has(id) && !usedTexts.has(text);
  });

  while (selectedQuestions.length < count && remainingQuestions.length > 0) {
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    const selected = remainingQuestions[randomIndex];
    selectedQuestions.push(selected);
    usedQuestionIds.add(generateQuestionId(selected));
    usedTexts.add(normalizeString(selected.text));
    remainingQuestions.splice(randomIndex, 1);
  }

  return shuffleArray(selectedQuestions);
}

function getRandomQuestionsWithTopicAndSubtopicDistribution(
  questions: Question[],
  count: number,
  topics: Set<string>,
  subTopics: Set<string>,
): Question[] {
  const selectedQuestions: Question[] = [];
  const usedQuestionIds = new Set<string>();
  const usedTexts = new Set<string>();

  const questionsByTopic = new Map<string, Question[]>();
  const questionsBySubTopic = new Map<string, Question[]>();

  questions.forEach((question) => {
    const topicKey = normalizeString(question.topicName || "");
    if (!questionsByTopic.has(topicKey)) {
      questionsByTopic.set(topicKey, []);
    }
    questionsByTopic.get(topicKey)!.push(question);

    const subTopicKey = normalizeString(question.subTopic || "");
    if (!questionsBySubTopic.has(subTopicKey)) {
      questionsBySubTopic.set(subTopicKey, []);
    }
    questionsBySubTopic.get(subTopicKey)!.push(question);
  });

  const topicsArray = Array.from(questionsByTopic.keys());
  shuffleArray(topicsArray);

  for (const topic of topicsArray) {
    if (selectedQuestions.length >= count) break;

    const availableQuestions = questionsByTopic.get(topic)!.filter((q) => {
      const id = generateQuestionId(q);
      const text = normalizeString(q.text);
      return !usedQuestionIds.has(id) && !usedTexts.has(text);
    });

    if (availableQuestions.length > 0) {
      const questionsInTopic = availableQuestions;
      const usedSubTopicsInTopic = new Set<string>();

      let chosenQuestion: Question | null = null;
      for (const q of shuffleArray(questionsInTopic)) {
        const subTopicKey = normalizeString(q.subTopic || "");
        if (!usedSubTopicsInTopic.has(subTopicKey)) {
          chosenQuestion = q;
          usedSubTopicsInTopic.add(subTopicKey);
          break;
        }
      }

      if (!chosenQuestion && availableQuestions.length > 0) {
        chosenQuestion =
          availableQuestions[
            Math.floor(Math.random() * availableQuestions.length)
          ];
      }

      if (chosenQuestion) {
        selectedQuestions.push(chosenQuestion);
        usedQuestionIds.add(generateQuestionId(chosenQuestion));
        usedTexts.add(normalizeString(chosenQuestion.text));
      }
    }
  }

  if (selectedQuestions.length < count) {
    const subTopicsArray = Array.from(questionsBySubTopic.keys());
    shuffleArray(subTopicsArray);

    const usedSubTopics = new Set<string>();
    selectedQuestions.forEach((q) => {
      usedSubTopics.add(normalizeString(q.subTopic || ""));
    });

    for (const subTopic of subTopicsArray) {
      if (selectedQuestions.length >= count) break;
      if (usedSubTopics.has(subTopic)) continue;

      const availableQuestions = questionsBySubTopic
        .get(subTopic)!
        .filter((q) => {
          const id = generateQuestionId(q);
          const text = normalizeString(q.text);
          return !usedQuestionIds.has(id) && !usedTexts.has(text);
        });

      if (availableQuestions.length > 0) {
        const randomQuestion =
          availableQuestions[
            Math.floor(Math.random() * availableQuestions.length)
          ];
        selectedQuestions.push(randomQuestion);
        usedQuestionIds.add(generateQuestionId(randomQuestion));
        usedTexts.add(normalizeString(randomQuestion.text));
        usedSubTopics.add(subTopic);
      }
    }
  }

  if (selectedQuestions.length < count) {
    const remainingQuestions = questions.filter((q) => {
      const id = generateQuestionId(q);
      const text = normalizeString(q.text);
      return !usedQuestionIds.has(id) && !usedTexts.has(text);
    });

    while (selectedQuestions.length < count && remainingQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
      const selected = remainingQuestions[randomIndex];
      selectedQuestions.push(selected);
      usedQuestionIds.add(generateQuestionId(selected));
      usedTexts.add(normalizeString(selected.text));
      remainingQuestions.splice(randomIndex, 1);
    }
  }

  return shuffleArray(selectedQuestions);
}

function getRandomQuestionsSimple(
  questions: Question[],
  count: number,
): Question[] {
  const shuffled = shuffleArray([...questions]);
  const selected: Question[] = [];
  const usedTexts = new Set<string>();

  for (const question of shuffled) {
    if (selected.length >= count) break;
    const text = normalizeString(question.text);
    if (!usedTexts.has(text)) {
      selected.push(question);
      usedTexts.add(text);
    }
  }

  return selected;
}

function getRandomQuestionsWithSubtopicDistribution(
  questions: Question[],
  count: number,
  subTopics: Set<string>,
): Question[] {
  const questionsBySubTopic = new Map<string, Question[]>();

  questions.forEach((question) => {
    const key = normalizeString(question.subTopic || "");
    if (!questionsBySubTopic.has(key)) {
      questionsBySubTopic.set(key, []);
    }
    questionsBySubTopic.get(key)!.push(question);
  });

  const selectedQuestions: Question[] = [];
  const usedQuestionIds = new Set<string>();
  const usedTexts = new Set<string>();

  const subTopicsArray = Array.from(questionsBySubTopic.keys());
  shuffleArray(subTopicsArray);

  for (const subTopic of subTopicsArray) {
    if (selectedQuestions.length >= count) break;

    const availableQuestions = questionsBySubTopic
      .get(subTopic)!
      .filter((q) => {
        const id = generateQuestionId(q);
        const text = normalizeString(q.text);
        return !usedQuestionIds.has(id) && !usedTexts.has(text);
      });

    if (availableQuestions.length > 0) {
      const randomQuestion =
        availableQuestions[
          Math.floor(Math.random() * availableQuestions.length)
        ];
      selectedQuestions.push(randomQuestion);
      usedQuestionIds.add(generateQuestionId(randomQuestion));
      usedTexts.add(normalizeString(randomQuestion.text));
    }
  }

  const remainingQuestions = questions.filter((q) => {
    const id = generateQuestionId(q);
    const text = normalizeString(q.text);
    return !usedQuestionIds.has(id) && !usedTexts.has(text);
  });

  while (selectedQuestions.length < count && remainingQuestions.length > 0) {
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    const selected = remainingQuestions[randomIndex];
    selectedQuestions.push(selected);
    usedQuestionIds.add(generateQuestionId(selected));
    usedTexts.add(normalizeString(selected.text));
    remainingQuestions.splice(randomIndex, 1);
  }

  return shuffleArray(selectedQuestions);
}

export function selectRandomQuestionsStrict(
  allQuestions: Question[],
  filter: QuestionFilterV2,
): Question[] {
  if (allQuestions.length === 0) {
    return [];
  }

  let filteredQuestions = allQuestions;
  if (filter.subject) {
    filteredQuestions = filteredQuestions.filter(
      (q) => (q.subjectName || "").toLowerCase() === filter.subject!.toLowerCase(),
    );
  }

  if (
    filter.topics &&
    filter.topics.size > 0 &&
    filter.subTopics &&
    filter.subTopics.size > 0
  ) {
    filteredQuestions = filteredQuestions.filter((question) => {
      const normalizedTopic = normalizeString(question.topicName || "");
      const normalizedSubTopic = normalizeString(question.subTopic || "");

      const matchesTopic = Array.from(filter.topics!).some(
        (topic) => normalizeString(topic) === normalizedTopic,
      );

      const matchesSubTopic = Array.from(filter.subTopics!).some(
        (subTopic) => normalizeString(subTopic) === normalizedSubTopic,
      );

      return matchesTopic && matchesSubTopic;
    });
  } else if (filter.topics && filter.topics.size > 0) {
    filteredQuestions = filteredQuestions.filter((question) => {
      const normalizedTopic = normalizeString(question.topicName || "");
      return Array.from(filter.topics!).some(
        (topic) => normalizeString(topic) === normalizedTopic,
      );
    });
  } else if (filter.subTopics && filter.subTopics.size > 0) {
    filteredQuestions = filteredQuestions.filter((question) => {
      const normalizedSubTopic = normalizeString(question.subTopic || "");
      return Array.from(filter.subTopics!).some(
        (subTopic) => normalizeString(subTopic) === normalizedSubTopic,
      );
    });
  }

  if (filter.years && filter.years.length > 0) {
    filteredQuestions = filteredQuestions.filter((q) =>
      filter.years!.includes(Number(q.year)),
    );
  }

  const uniqueQuestions = new Map<string, Question>();

  filteredQuestions.forEach((question) => {
    const uniqueKey = `${normalizeString(question.text)}_${question.year}_${normalizeString(question.subTopic || "")}`;
    if (!uniqueQuestions.has(uniqueKey)) {
      uniqueQuestions.set(uniqueKey, question);
    }
  });

  filteredQuestions = Array.from(uniqueQuestions.values());

  if (filteredQuestions.length === 0) {
    return [];
  }

  if (filteredQuestions.length <= filter.count) {
    return shuffleArray([...filteredQuestions]);
  }

  if (filter.ensureTopicDistribution && filter.ensureSubtopicDistribution) {
    return getRandomQuestionsWithTopicAndSubtopicDistribution(
      filteredQuestions,
      filter.count,
      filter.topics || new Set(),
      filter.subTopics || new Set(),
    );
  } else if (filter.ensureTopicDistribution) {
    return getRandomQuestionsWithTopicDistribution(
      filteredQuestions,
      filter.count,
      filter.topics || new Set(),
    );
  } else if (filter.ensureSubtopicDistribution) {
    return getRandomQuestionsWithSubtopicDistribution(
      filteredQuestions,
      filter.count,
      filter.subTopics || new Set(),
    );
  } else {
    return getRandomQuestionsSimple(filteredQuestions, filter.count);
  }
}
