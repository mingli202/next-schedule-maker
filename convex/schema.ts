import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { CollectionPolicy } from "./types";

const schema = defineSchema({
  users: defineTable({
    firebaseId: v.string(),
    collectionPolicy: CollectionPolicy,
    schedulesVersion: v.number(),
  }).index("by_firebaseId", ["firebaseId"]),

  schedules: defineTable({
    userId: v.id("users"),
    name: v.string(),
    source: v.string(), // source of data
  }).index("by_userId_source", ["userId", "source"]),

  sections: defineTable({
    userId: v.id("users"),
    scheduleId: v.id("schedules"),
    sectionId: v.string(),
    colorIndex: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_scheduleId", ["scheduleId"]),

  feedback: defineTable({
    feedback: v.string(),
    contactInfo: v.optional(v.string()),
  }),
});

export default schema;
