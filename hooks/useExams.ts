import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createExam,
  getExamById,
  getExamWithQuestions,
  getExamHistory,
  syncExamCompletion,
  type CreateExamPayload,
  type SyncExamPayload,
} from "../repositories/exams.repository";
import type { ExamType } from "../types";

export function useExam(examId: string) {
  return useQuery({
    queryKey: ["exam", examId],
    queryFn: () => getExamById(examId),
    enabled: Boolean(examId),
  });
}

export function useExamWithQuestions(examId: string) {
  return useQuery({
    queryKey: ["exam", "with-questions", examId],
    queryFn: () => getExamWithQuestions(examId),
    enabled: Boolean(examId),
  });
}

export function useExamHistory(params?: {
  userId?: string;
  type?: ExamType;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["exams", "history", params],
    queryFn: () => getExamHistory(params),
  });
}

export function useCreateExamMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExamPayload) => createExam(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.setQueryData(["exam", "with-questions", data.id], data);
    },
  });
}

export function useSyncExamMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SyncExamPayload) => syncExamCompletion(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exam", variables.examId] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}
