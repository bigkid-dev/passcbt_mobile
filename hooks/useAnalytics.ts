import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOverallAnalytics,
  recordStudyMinutes,
} from "../repositories/analytics.repository";

export function useOverallAnalytics(userId?: string) {
  return useQuery({
    queryKey: ["analytics", "overall", userId],
    queryFn: () => getOverallAnalytics(userId!),
    enabled: Boolean(userId),
  });
}

export function useRecordStudyMinutesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { userId: string; minutes: number }) =>
      recordStudyMinutes(params.userId, params.minutes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["analytics", "overall", variables.userId] });
    },
  });
}
