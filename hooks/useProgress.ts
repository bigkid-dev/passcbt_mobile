import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserProgress,
  updateSubjectProgress,
} from "../repositories/progress.repository";

export function useUserProgress(userId?: string) {
  return useQuery({
    queryKey: ["progress", userId],
    queryFn: () => getUserProgress(userId!),
    enabled: Boolean(userId),
  });
}

export function useUpdateProgressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { userId: string; subjectId: string; progressValue: number }) =>
      updateSubjectProgress(params.userId, params.subjectId, params.progressValue),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["progress", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
