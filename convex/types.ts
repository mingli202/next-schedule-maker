import { v } from "convex/values";
import { z } from "zod";

export const CollectionPolicy = v.union(
  v.literal("off"),
  v.literal("on"),
  v.literal("anonymous"),
);

export const SavedSection = z.object({
  sectionId: z.string(),
  colorIndex: z.number(),
});

export const SavedSchedule = z.object({
  id: z.string(),
  creationTime: z.number(),
  name: z.string(),
  source: z.string(),
  sections: z.array(SavedSection),
});

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

export const NewUpload = v.object({
  uploadId: v.id("uploads"),
});

export const UploadData = v.object({
  storageUrl: v.string(),
  semester: v.string(),
  displayName: v.string(),
});

export const UserUploadData = v.object({
  ...UploadData.fields,
  userUploadId: v.id("userUploads"),
  userUploadTime: v.number(),
});

export const OfficialUploadData = v.object({
  ...UploadData.fields,
  officialUploadId: v.id("officialUploads"),
  officialUploadTime: v.number(),
});

export const OfficialUploadMetaData = z.object({
  comments: z.array(z.string()),
});

export type CollectionPolicy = typeof CollectionPolicy.type;
export type SavedSection = z.infer<typeof SavedSection>;
export type SavedSchedule = z.infer<typeof SavedSchedule>;
export type SavedScheduleInput = typeof SavedScheduleInput.type;
export type NewUpload = typeof NewUpload.type;
export type UploadData = typeof UploadData.type;
export type UserUploadData = typeof UserUploadData.type;
export type OfficialUploadData = typeof OfficialUploadData.type;
export type OfficialUploadMetaData = z.infer<typeof OfficialUploadMetaData>;
