import { z } from "zod/v4";
import { SemesterNames } from "../util/semesterNames";

export const SavedScheduleDataSchema = z.object({
  bgColor: z.string(),
  textColor: z.string(),
  dataId: z.number(),
});

export const ReportSchema = z.object({
  count: z.number(),
  reason: z.string(),
});

export const UserSchema = z.object({
  userId: z.string(),
  lastSignedIn: z.string(),
  email: z.string(),
  name: z.string(),
});

export const SavedScheduleSchema = z.object({
  scheduleId: z.string(),
  name: z.string(),
  semester: z.literal(SemesterNames.Current),
  userId: UserSchema.shape.userId,
});

function table<T extends z.ZodType>(schema: T) {
  return z.record(z.string(), schema);
}

export const DatabaseSchema = z.object({
  users: table(UserSchema),
  reports: table(ReportSchema),
  savedSchedules: table(SavedScheduleSchema), // scheduleId: SavedScheduleSchema
  savedScheduleData: table(SavedScheduleDataSchema), // dataId: SavedDataSchema
});

export type SavedScheduleDataSchema = z.infer<typeof SavedScheduleDataSchema>;
export type SavedScheduleSchema = z.infer<typeof SavedScheduleSchema>;
export type ReportSchema = z.infer<typeof ReportSchema>;
export type UserSchema = z.infer<typeof UserSchema>;
export type DatabaseSchema = z.infer<typeof DatabaseSchema>;
export type TableNames = keyof DatabaseSchema;
