import { z } from "zod";

export const TimeSchema = z.object({
  "1": z.array(z.number()).optional(),
  "2": z.array(z.number()).optional(),
  "3": z.array(z.number()).optional(),
  "4": z.array(z.number()).optional(),
  "5": z.array(z.number()).optional(),
});
export type Time = z.infer<typeof TimeSchema>;

export const RatingSchema = z.object({
  prof: z.string(),
  score: z.number(),
  avg: z.number(),
  nRating: z.number(),
  takeAgain: z.number(),
  difficulty: z.number(),
  status: z.string(),
});
export type Rating = z.infer<typeof RatingSchema>;

export const ClassSchema = z.object({
  count: z.number(),
  program: z.string(),
  course: z.string(),
  code: z.string(),
  codeHeader: z.string(),
  section: z.string(),
  disc: z.string(),
  lecture: z
    .object({
      prof: z.string(),
      title: z.string(),
      rating: RatingSchema.nullable(),
      time: z.record(z.string(), z.array(z.string())),
    })
    .nullable(),
  lab: z
    .object({
      prof: z.string(),
      title: z.string(),
      rating: RatingSchema.nullable(),
      time: z.record(z.string(), z.array(z.string())),
    })
    .nullable(),
  more: z.string(),
  viewData: z.array(TimeSchema),
});
export type Class = z.infer<typeof ClassSchema>;

export const ClassesDataSchema = z.object({
  allClasses: z.record(z.string(), ClassSchema),
  commitId: z.string(),
});
export type ClassesData = z.infer<typeof ClassesDataSchema>;
