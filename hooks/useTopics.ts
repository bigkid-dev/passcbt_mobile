import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllSubjects,
  getEnrolledSubjects,
  enrollSubject,
  unenrollSubject,
  getTopicsBySubject,
  setTopicCompletion,
  getCompletedTopics,
} from "../repositories/topics.repository";

export function useSubjects() {
  return useQuery({
    queryKey: ["subjects", "all"],
    queryFn: () => getAllSubjects(),
  });
}

export function useEnrolledSubjects(userId?: string) {
  return useQuery({
    queryKey: ["subjects", "enrolled", userId],
    queryFn: () => getEnrolledSubjects(userId!),
    enabled: Boolean(userId),
  });
}

export function useSubjectTopics(subjectId?: string, userId?: string) {
  return useQuery({
    queryKey: ["topics", "subject", subjectId, userId],
    queryFn: () => getTopicsBySubject(subjectId!, userId),
    enabled: Boolean(subjectId),
  });
}

export function useCompletedTopics(userId?: string) {
  return useQuery({
    queryKey: ["topics", "completed", userId],
    queryFn: () => getCompletedTopics(userId!),
    enabled: Boolean(userId),
  });
}

export function useEnrollSubjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { userId: string; subjectId: string }) =>
      enrollSubject(params.userId, params.subjectId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subjects", "enrolled", variables.userId] });
    },
  });
}

export function useUnenrollSubjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { userId: string; subjectId: string }) =>
      unenrollSubject(params.userId, params.subjectId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subjects", "enrolled", variables.userId] });
    },
  });
}

export function useSetTopicCompletionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { userId: string; topicId: string; subjectId?: string; isComplete: boolean }) =>
      setTopicCompletion(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      queryClient.invalidateQueries({ queryKey: ["topics", "completed", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
