import { db } from "../db/client";
import { syncOutbox, generateUUID, OutboxAction } from "../db/schema";

export async function enqueueOutboxMutation(
  table: string,
  rowId: string,
  action: OutboxAction,
  payload: unknown,
): Promise<void> {
  try {
    await db.insert(syncOutbox).values({
      id: generateUUID(),
      table,
      rowId,
      action,
      payload: typeof payload === "string" ? payload : JSON.stringify(payload),
      attempts: 0,
      status: "pending",
    });
  } catch (error) {
    console.error("Failed to enqueue outbox mutation:", error);
  }
}
