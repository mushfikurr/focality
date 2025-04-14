import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    roomId: v.optional(v.id("rooms")),
  }).index("by_room", ["roomId"]),

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
    sessionId: v.id("sessions"),
    userId: v.id("users"),
    title: v.string(),
    participants: v.array(v.id("users")),
    shareId: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_shareId", ["shareId"])
    .index("by_session", ["sessionId"]),

  chats: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("users"),
    content: v.string(),
  })
    .index("by_room", ["roomId"])
    .index("by_user", ["userId"]),

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
