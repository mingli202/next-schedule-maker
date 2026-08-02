import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { CollectionPolicy } from "./types";
import { ParsedPdf, Rating } from "./types.generated";

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

  userUploads: defineTable({
    userId: v.id("users"),
    uploadId: v.id("uploads"),
    displayName: v.string(),
  }).index("by_userId", ["userId"]),

  uploads: defineTable({
    semester: v.string(),
    hash: v.string(),
    storageId: v.id("_storage"),
  }).index("by_hash", ["hash"]),

  ratings: defineTable(Rating).index("by_prof", ["prof"]),
});

export default schema;
