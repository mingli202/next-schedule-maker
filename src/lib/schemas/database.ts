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
  semester: z.literal(SemesterNames.current),
});

export const Database = z.object({
  users: z.record(
    z.string(),
    z.object({
      schedules: SavedScheduleData,
    }),
  ),
  reports: z.record(
    z.number(),
    z.object({
      count: z.number(),
      reason: z.string(),
    }),
  ),
});

export type SavedScheduleData = z.infer<typeof SavedScheduleData>;
export type Database = z.infer<typeof Database>;
