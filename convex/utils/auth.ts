import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { betterAuthComponent } from "../auth";

// Authenticate a user and return their ID
export async function authenticatedUser(
  ctx: QueryCtx | MutationCtx,
): Promise<Id<"users">> {
  // You can get the user id directly from Convex via ctx.auth
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("User not authenticated");
  }

  // The component provides a convenience method to get the user id
  const userId = await betterAuthComponent.getAuthUserId(ctx);
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return userId as Id<"users">;
}

// Check if a user is the host of a session
export async function validateSessionHost(
  ctx: QueryCtx | MutationCtx,
  sessionId: Id<"sessions">,
): Promise<Id<"users">> {
  const userId = await authenticatedUser(ctx);
  const session = await ctx.db.get(sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  if (session.hostId !== userId) {
    throw new Error("Only the host can perform this action");
  }

  return userId;
}

// Check if a user is a participant in a room
export async function validateRoomParticipant(
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"rooms">,
): Promise<Id<"users">> {
  const userId = await authenticatedUser(ctx);
  const room = await ctx.db.get(roomId);

  if (!room) {
    throw new Error("Room not found");
  }

  if (!room.participants.includes(userId)) {
    throw new Error("Not a participant in this room");
  }

  return userId;
}
