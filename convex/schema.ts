import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { CollectionPolicy } from "./types";

const schema = defineSchema({
  sectionsBackup: defineTable({
    backup: v.array(
      v.object({
        userId: v.id("users"),
        scheduleId: v.id("schedules"),
        sectionId: v.string(),
        colorIndex: v.number(),
      }),
    ),
  }),

  users: defineTable({
    firebaseId: v.string(),
    collectionPolicy: CollectionPolicy,
    schedulesVersion: v.number(),
  }).index("by_firebaseId", ["firebaseId"]),

  schedules: defineTable({
    userId: v.id("users"),
    name: v.string(),
    source: v.string(), // source of data
    sections: v.array(
      v.object({
        sectionId: v.string(),
        colorIndex: v.number(),
      }),
    ),
  }).index("by_userId_source", ["userId", "source"]),

  feedback: defineTable({
    feedback: v.string(),
    contactInfo: v.optional(v.string()),
  }),
});

export default schema;
