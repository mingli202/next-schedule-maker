import { v } from "convex/values";

export const CollectionPolicy = v.union(
  v.literal("off"),
  v.literal("on"),
  v.literal("anonymous"),
);
export type CollectionPolicy = typeof CollectionPolicy.type;

export const SavedSchedule = v.object({
  id: v.id("schedules"),
  creationTime: v.number(),
  name: v.string(),
  source: v.string(),
  sections: v.array(
    v.object({
      sectionId: v.number(),
      colorIndex: v.number(),
    }),
  ),
});
export type SavedSchedule = typeof SavedSchedule.type;
