import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { CollectionPolicy } from "./types";
import { Rating, SectionsDiff } from "./types.generated";

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
    role: v.optional(v.union(v.literal("admin"))),
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

  userUploads: defineTable({
    userId: v.id("users"),
    uploadId: v.id("uploads"),
    displayName: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_uploadId", ["uploadId"]),

  uploads: defineTable({
    semester: v.string(),
    hash: v.string(),
    storageId: v.id("_storage"),
    deleteScheduleId: v.optional(v.id("_scheduled_functions")),
  }).index("by_hash", ["hash"]),

  ratings: defineTable(Rating).index("by_prof", ["prof"]),

  officialUploads: defineTable({
    comments: v.array(v.string()),
    sectionsDiff: v.optional(SectionsDiff),
    uploadId: v.id("uploads"),
    displayName: v.string(),
  }).index("by_uploadId", ["uploadId"]),
});

export default schema;
