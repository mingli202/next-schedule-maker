import { z } from "zod/v4";
import { SemesterNames } from "../util/semesterNames";

export const Saved = z.object({
  bgColor: z.string(),
  textColor: z.string(),
  id: z.number(),
});

export const SavedScheduleData = z.object({
  data: z.array(Saved),
  name: z.string(),
  semester: z.literal(SemesterNames.Current),
});

export const Report = z.record(
  z.number(),
  z.object({
    count: z.number(),
    reason: z.string(),
  }),
);

export const User = z.object({
  schedules: SavedScheduleData,
});

export const Database = z.object({
  users: z.record(z.string(), User),
  reports: Report,
});

export type SavedScheduleData = z.infer<typeof SavedScheduleData>;
export type Report = z.infer<typeof Report>;
export type User = z.infer<typeof User>;
export type Database = z.infer<typeof Database>;
