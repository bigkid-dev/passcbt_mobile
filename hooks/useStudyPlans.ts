import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudyPlans,
  generateAndSaveStudyPlan,
  toggleStudyPlanItem,
  deleteStudyPlan,
} from "../repositories/studyPlans.repository";
import type { StudyPlanConfig, Syllabus } from "../lib/algorithm/studyPlan";

export function useStudyPlans(userId?: string) {
  return useQuery({
    queryKey: ["study-plans", userId],
    queryFn: () => getStudyPlans(userId!),
    enabled: Boolean(userId),
  });
}

export function useGenerateStudyPlanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { userId: string; syllabi: Syllabus[]; config: StudyPlanConfig }) =>
      generateAndSaveStudyPlan(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["study-plans", variables.userId] });
    },
  });
}

export function useToggleStudyPlanItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { itemId: string; completed: boolean; userId?: string }) =>
      toggleStudyPlanItem(params.itemId, params.completed),
    onSuccess: (_, variables) => {
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: ["study-plans", variables.userId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["study-plans"] });
      }
    },
  });
}

export function useDeleteStudyPlanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { planId: string; userId?: string }) =>
      deleteStudyPlan(params.planId),
    onSuccess: (_, variables) => {
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: ["study-plans", variables.userId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["study-plans"] });
      }
    },
  });
}
