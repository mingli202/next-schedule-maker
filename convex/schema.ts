import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  users: defineTable({
    firebaseId: v.string(),
  }).index("by_firebaseId", ["firebaseId"]),

  schedules: defineTable({
    userId: v.id("users"),
  }).index("by_userId", ["userId"]),
});

export default schema;
