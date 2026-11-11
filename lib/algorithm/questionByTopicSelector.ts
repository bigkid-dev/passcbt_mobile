import {
  Question,
  selectRandomQuestionsStrict,
  QuestionFilterV2,
} from "./questionSelector";

export function selectQuestionsByTopic(
  allQuestions: Question[],
  topicName: string,
  count = 40,
  subTopics?: string[],
): Question[] {
  const topicsSet = new Set<string>([topicName]);
  const subTopicsSet = new Set<string>(subTopics || []);

  const filter: QuestionFilterV2 = {
    count,
    topics: topicsSet,
    subTopics: subTopicsSet,
    ensureTopicDistribution: false,
    ensureSubtopicDistribution: Boolean(subTopics && subTopics.length > 0),
  };

  return selectRandomQuestionsStrict(allQuestions, filter);
}
