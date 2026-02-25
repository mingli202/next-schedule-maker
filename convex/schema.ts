import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { CollectionPolicy } from "./types";

const schema = defineSchema({
  users: defineTable({
    firebaseId: v.string(),
    collectionPolicy: CollectionPolicy,
  }).index("by_firebaseId", ["firebaseId"]),

  schedules: defineTable({
    userId: v.id("users"),
    name: v.string(),
    semester: v.string(),
  }).index("by_userId_semester", ["userId", "semester"]),

  sections: defineTable({
    userId: v.id("users"),
    scheduleId: v.id("schedules"),
    sectionId: v.number(),
    colorIndex: v.number(),
  }).index("by_userId_scheduleId", ["userId", "scheduleId"]),
});

export default schema;
