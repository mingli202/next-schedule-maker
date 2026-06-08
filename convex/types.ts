import { v } from "convex/values";
import { z } from "zod";

export const CollectionPolicy = v.union(
  v.literal("off"),
  v.literal("on"),
  v.literal("anonymous"),
);
export type CollectionPolicy = typeof CollectionPolicy.type;

export const SavedSchedule = z.object({
  id: z.string(),
  creationTime: z.number(),
  name: z.string(),
  source: z.string(),
  sections: z.array(
    z.object({
      sectionId: z.string(),
      colorIndex: z.number(),
    }),
  ),
});
export type SavedSchedule = z.infer<typeof SavedSchedule>;

export const SavedScheduleInput = v.object({
  name: v.string(),
  source: v.string(),
  sections: v.array(
    v.object({
      sectionId: v.string(),
      colorIndex: v.number(),
    }),
  ),
});
export type SavedScheduleInput = typeof SavedScheduleInput.type;
