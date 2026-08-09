import { v } from "convex/values";
import { z } from "zod";

export const CollectionPolicy = v.union(
  v.literal("off"),
  v.literal("on"),
  v.literal("anonymous"),
);
export type CollectionPolicy = typeof CollectionPolicy.type;

export const SavedSection = z.object({
  sectionId: z.string(),
  colorIndex: z.number(),
});
export type SavedSection = z.infer<typeof SavedSection>;

export const SavedSchedule = z.object({
  id: z.string(),
  creationTime: z.number(),
  name: z.string(),
  source: z.string(),
  sections: z.array(SavedSection),
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

export const NewUpload = v.object({
  uploadId: v.id("uploads"),
});
export type NewUpload = typeof NewUpload.type;

export const UserUploadData = v.object({
  storageUrl: v.string(),
  semester: v.string(),
  displayName: v.string(),
  userUploadTime: v.number(),
  userUploadId: v.id("userUploads"),
});
export type UserUploadData = typeof UserUploadData.type;

export const OfficialUploadData = z.object({
  comments: z.array(z.string()),
});
export type OfficialUploadData = z.infer<typeof OfficialUploadData>;
