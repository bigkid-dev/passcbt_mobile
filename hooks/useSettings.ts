import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAppSettings,
  updateAppSettings,
  toggleSubscriptionEntitlement,
  getCurrentUser,
  updateUserProfile,
} from "../repositories/settings.repository";
import type { AppSettings, User } from "../types";

export function useAppSettings() {
  return useQuery({
    queryKey: ["settings", "app"],
    queryFn: () => getAppSettings(),
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["user", "current"],
    queryFn: () => getCurrentUser(),
  });
}

export function useUpdateAppSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AppSettings>) => updateAppSettings(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["settings", "app"], data);
    },
  });
}

export function useToggleSubscriptionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { isSubscribed: boolean; userId?: string }) =>
      toggleSubscriptionEntitlement(params.isSubscribed, params.userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["settings", "app"] });
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
    },
  });
}

export function useUpdateUserProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { userId: string; data: Partial<User> }) =>
      updateUserProfile(params.userId, params.data),
    onSuccess: (data) => {
      queryClient.setQueryData(["user", "current"], data);
    },
  });
}
