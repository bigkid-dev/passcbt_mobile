import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { appSettings, users, generateUUID } from "../db/schema";
import type { AppSettings, User, ThemeType } from "../types";
import { enqueueOutboxMutation } from "./outbox.repository";

export async function getAppSettings(): Promise<AppSettings> {
  const rows = await db
    .select()
    .from(appSettings)
    .where(eq(appSettings.id, "default"))
    .limit(1);

  if (rows.length > 0) return rows[0];

  const defaultSettings = {
    id: "default",
    theme: "dark" as ThemeType,
    isSubscribed: false,
    offlineDownloaded: false,
    isSeeded: false,
    updatedAt: new Date(),
  };

  await db.insert(appSettings).values(defaultSettings);
  return defaultSettings;
}

export async function updateAppSettings(data: Partial<AppSettings>): Promise<AppSettings> {
  const now = new Date();
  await db
    .update(appSettings)
    .set({ ...data, updatedAt: now })
    .where(eq(appSettings.id, "default"));

  return getAppSettings();
}

export async function toggleSubscriptionEntitlement(
  isSubscribed: boolean,
  userId?: string,
): Promise<{ success: boolean; isSubscribed: boolean }> {
  const now = new Date();

  await db
    .update(appSettings)
    .set({ isSubscribed, updatedAt: now })
    .where(eq(appSettings.id, "default"));

  if (userId) {
    await db
      .update(users)
      .set({
        isSubscribed,
        plan: isSubscribed ? "monthly" : null,
        period: isSubscribed ? "monthly" : null,
        updatedAt: now,
      })
      .where(eq(users.id, userId));

    await enqueueOutboxMutation("users", userId, "UPDATE", {
      isSubscribed,
      plan: isSubscribed ? "monthly" : null,
      period: isSubscribed ? "monthly" : null,
    });
  }

  return { success: true, isSubscribed };
}

export async function getCurrentUser(): Promise<User | null> {
  const rows = await db.select().from(users).limit(1);
  if (rows.length > 0) return rows[0];

  const defaultUserId = generateUUID();
  const newUser = {
    id: defaultUserId,
    firstName: "Student",
    lastName: "User",
    email: "student@passcbt.local",
    hasOnboarded: false,
    totalStudyMinutes: 0,
    isSubscribed: false,
    syncStatus: "synced" as const,
  };

  await db.insert(users).values(newUser);
  return (await db.select().from(users).where(eq(users.id, defaultUserId)).limit(1))[0] ?? null;
}

export async function updateUserProfile(
  userId: string,
  data: Partial<User>,
): Promise<User | null> {
  const now = new Date();
  await db
    .update(users)
    .set({ ...data, updatedAt: now })
    .where(eq(users.id, userId));

  await enqueueOutboxMutation("users", userId, "UPDATE", data);

  const updated = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return updated[0] ?? null;
}
