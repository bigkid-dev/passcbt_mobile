import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getQuestions,
  getQuestionsBySubject,
  getRandomQuestionsForSession,
  getQuestionById,
  createQuestion,
  type QuestionQueryFilter,
} from "../repositories/questions.repository";
import type { NewQuestion } from "../types";

export function useQuestions(filter?: QuestionQueryFilter) {
  return useQuery({
    queryKey: ["questions", filter],
    queryFn: () => getQuestions(filter),
  });
}

export function useSubjectQuestions(subjectName: string, limit = 40) {
  return useQuery({
    queryKey: ["questions", "subject", subjectName, limit],
    queryFn: () => getQuestionsBySubject(subjectName, limit),
    enabled: Boolean(subjectName),
  });
}

export function useQuestionSession(params: {
  subjectNames?: string[];
  board?: any;
  yearFrom?: number;
  yearTo?: number;
  limit?: number;
  topicId?: string;
  mode?: string;
  topics?: Set<string>;
  subTopics?: Set<string>;
  enabled?: boolean;
}) {
  const { enabled = true, ...rest } = params;
  return useQuery({
    queryKey: ["questions", "session", rest],
    queryFn: () => getRandomQuestionsForSession(rest),
    enabled,
  });
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: ["questions", "detail", id],
    queryFn: () => getQuestionById(id),
    enabled: Boolean(id),
  });
}

export function useCreateQuestionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NewQuestion) => createQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}
