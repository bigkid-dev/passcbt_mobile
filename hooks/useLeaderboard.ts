import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLeaderboard,
  updateUserPoints,
} from "../repositories/leaderboard.repository";

export function useLeaderboard(currentUserId?: string) {
  return useQuery({
    queryKey: ["leaderboard", currentUserId],
    queryFn: () => getLeaderboard(currentUserId),
  });
}

export function useUpdateLeaderboardPointsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { userId: string; points: number; displayName?: string }) =>
      updateUserPoints(params.userId, params.points, params.displayName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}
