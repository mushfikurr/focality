import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export type AchievementType = "level";
export type Condition = "gte" | "lte" | "eq";

const schema = defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    sessionId: v.optional(v.id("sessions")),
    lastActive: v.optional(v.number()),
    xp: v.optional(v.number()),
    highestStreak: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("by_session", ["sessionId"]),

  achievementDefinitions: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.union(v.literal("level")),
    condition: v.union(v.literal("gte"), v.literal("lte"), v.literal("eq")),
    conditionValue: v.string(),
  }),

  achievements: defineTable({
    userId: v.id("users"),
    achievementDefinitionId: v.id("achievementDefinitions"),
  })
    .index("by_user", ["userId"])
    .index("by_definition_user", ["achievementDefinitionId", "userId"]),

  streaks: defineTable({
    userId: v.id("users"),
    streak: v.number(),
  }).index("by_user", ["userId"]),

  sessions: defineTable({
    hostId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.optional(v.string()),
    running: v.boolean(),
    currentTaskId: v.optional(v.id("tasks")),
    shareId: v.string(),
    visibility: v.union(v.literal("public"), v.literal("private")),
    completed: v.boolean(),
  })
    .index("by_user", ["hostId"])
    .index("by_share_id", ["shareId"])
    .index("by_visibility", ["visibility"]),

  chats: defineTable({
    sessionId: v.id("sessions"),
    userId: v.id("users"),
    content: v.string(),
  })
    .index("by_session", ["sessionId"])
    .index("by_user", ["userId"]),

  tasks: defineTable({
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    type: v.union(v.literal("task"), v.literal("break")),
    duration: v.number(),
    elapsed: v.number(),
    description: v.string(),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
  })
    .index("by_session", ["sessionId"])
    .index("by_user", ["userId"])
    .index("by_user_completion_time", ["userId", "completedAt"]),
});

export default schema;
