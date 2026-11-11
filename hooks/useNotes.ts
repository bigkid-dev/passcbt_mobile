import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNoteByTopicId, saveNote } from "../repositories/notes.repository";

export function useTopicNote(topicId?: string) {
  return useQuery({
    queryKey: ["note", topicId],
    queryFn: () => getNoteByTopicId(topicId!),
    enabled: Boolean(topicId),
  });
}

export function useSaveNoteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      topicId: string;
      content: string;
      summary?: string;
      keyTerms?: Array<{ term: string; definition: string }>;
      examTips?: string;
      memoryTrick?: string;
      html?: string;
      calculations?: Array<{ question: string; solution: string; answer: string; year?: string }>;
    }) => saveNote(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["note", variables.topicId] });
    },
  });
}
