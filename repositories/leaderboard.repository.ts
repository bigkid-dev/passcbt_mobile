import { eq, desc } from "drizzle-orm";
import { db } from "../db/client";
import { leaderboard, users, generateUUID } from "../db/schema";
import { enqueueOutboxMutation } from "./outbox.repository";

export interface LeaderboardItem {
  rank: number;
  userId: string;
  displayName: string;
  avatarInitials: string;
  xp: number;
  isCurrentUser: boolean;
  imageUrl: string | null;
}

export interface LeaderboardResult {
  entries: LeaderboardItem[];
  myEntry: LeaderboardItem | null;
  total: number;
}

function getInitials(first?: string | null, last?: string | null): string {
  const f = first?.charAt(0)?.toUpperCase() ?? "";
  const l = last?.charAt(0)?.toUpperCase() ?? "";
  return f + l || "ST";
}

export async function getLeaderboard(currentUserId?: string): Promise<LeaderboardResult> {
  const rows = await db
    .select()
    .from(leaderboard)
    .orderBy(desc(leaderboard.points))
    .limit(100);

  const entries: LeaderboardItem[] = [];

  for (let i = 0; i < rows.length; i++) {
    const entry = rows[i];
    const userRows = await db
      .select({
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(users)
      .where(eq(users.id, entry.userId))
      .limit(1);

    const user = userRows[0];
    const displayName =
      entry.displayName ||
      (user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : null) ||
      "Student";

    const isCurrent = currentUserId ? entry.userId === currentUserId : entry.isCurrentUser;

    entries.push({
      rank: i + 1,
      userId: entry.userId,
      displayName,
      avatarInitials: entry.avatarInitials || getInitials(user?.firstName, user?.lastName),
      xp: entry.points,
      isCurrentUser: Boolean(isCurrent),
      imageUrl: entry.imageUrl,
    });
  }

  const myEntry = entries.find((e) => e.isCurrentUser) ?? null;

  return {
    entries,
    myEntry,
    total: entries.length,
  };
}

export async function updateUserPoints(
  userId: string,
  pointsToAdd: number,
  displayName?: string,
): Promise<{ success: boolean }> {
  const now = new Date();
  const existing = await db
    .select()
    .from(leaderboard)
    .where(eq(leaderboard.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    const current = existing[0];
    const newPoints = current.points + pointsToAdd;
    await db
      .update(leaderboard)
      .set({
        points: newPoints,
        displayName: displayName || current.displayName,
        updatedAt: now,
      })
      .where(eq(leaderboard.id, current.id));

    await enqueueOutboxMutation("leaderboard", current.id, "UPDATE", {
      points: newPoints,
      updatedAt: now,
    });
  } else {
    const id = generateUUID();
    const newEntry = {
      id,
      userId,
      displayName: displayName || "Student",
      avatarInitials: "ST",
      points: pointsToAdd,
      rank: 1,
      isCurrentUser: true,
      syncStatus: "synced" as const,
    };
    await db.insert(leaderboard).values(newEntry);
    await enqueueOutboxMutation("leaderboard", id, "INSERT", newEntry);
  }

  return { success: true };
}
