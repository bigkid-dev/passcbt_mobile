import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  startExamSession,
  getActiveExamSession,
  finishExamSession,
  type StartSessionPayload,
} from "../repositories/sessions.repository";

export function useActiveSession(examId: string, userId?: string) {
  return useQuery({
    queryKey: ["session", "active", examId, userId],
    queryFn: () => getActiveExamSession(examId, userId),
    enabled: Boolean(examId),
  });
}

export function useStartSessionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StartSessionPayload) => startExamSession(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["session", "active", data.examId, data.userId], data);
    },
  });
}

export function useFinishSessionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { sessionId: string; score: number; timeTaken: number }) =>
      finishExamSession(params.sessionId, params.score, params.timeTaken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });
}
