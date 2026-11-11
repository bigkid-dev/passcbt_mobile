import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStorage } from "../lib/storage";

interface SettingsState {
  theme: "dark" | "light" | "system";
  isSubscribed: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  setTheme: (theme: "dark" | "light" | "system") => void;
  setSubscribed: (isSubscribed: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setHapticEnabled: (enabled: boolean) => void;
  toggleTheme: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "dark",
      isSubscribed: false,
      soundEnabled: true,
      hapticEnabled: true,
      setTheme: (theme) => set({ theme }),
      setSubscribed: (isSubscribed) => set({ isSubscribed }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setHapticEnabled: (hapticEnabled) => set({ hapticEnabled }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
    }),
    {
      name: "passcbt_settings_store",
      storage: createJSONStorage(() => secureStorage),
    },
  ),
);
