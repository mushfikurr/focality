import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // TODO: Remove timer and use current tasks duration instead. Clients should interpret the timer.
  sessions: defineTable({
    hostId: v.id("users"),
    userIds: v.array(v.id("users")),
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.optional(v.string()),
    running: v.boolean(),
    currentTaskId: v.optional(v.id("tasks")),
    roomId: v.optional(v.id("rooms")),
  })
    .index("by_user", ["hostId"])
    .index("by_room", ["roomId"]),

  rooms: defineTable({
    userId: v.id("users"),
    title: v.string(),
    participants: v.array(v.id("users")),
    chat: v.array(v.string()),
    shareId: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_shareId", ["shareId"]),

  tasks: defineTable({
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    type: v.union(v.literal("task"), v.literal("break")),
    duration: v.number(),
    elapsed: v.number(),
    description: v.string(),
    completed: v.boolean(),
  })
    .index("by_session", ["sessionId"])
    .index("by_user", ["userId"]),
});
