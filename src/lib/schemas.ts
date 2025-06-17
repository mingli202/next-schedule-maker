import { z } from "zod/v4";

export const TimeSchema = z.record(
  z.enum(["M", "T", "W", "R", "F"]),
  z.array(z.string()),
);

export const RatingSchema = z.object({
  score: z.number().min(0.0).max(100.0),
  avg: z.number().min(0.0).max(5.0),
  nRating: z.number().min(0.0),
  takeAgain: z.number().min(0.0).max(100.0),
  difficulty: z.number().min(0.0).max(5.0),
  status: z.enum(["foundn't", "found"]),
  prof: z.string(),
});

export const LecLabSchema = z.object({
  title: z.string(),
  prof: z.string(),
  time: TimeSchema,
  rating: RatingSchema.optional(),
});

export const ViewDataSchema = z.array(
  z.record(z.number().min(1).max(5), z.array(z.number().min(1).max(20))),
);

export const SectionSchema = z.object({
  program: z.string().regex(/[A-Z]+/),
  count: z.number(),
  section: z.string().regex(/^[0-9]{5}$/),
  course: z.string(),
  code: z.string().regex(/\w{3}-\w{3}-\w{1,2}/),
  lecture: LecLabSchema.optional(),
  lab: LecLabSchema.optional(),
  more: z.string(),
  viewData: ViewDataSchema,
});

export const ProfessorsSchema = z.array(z.string());
export const ColorsSchema = z.array(z.string());
export const AllClassesSchema = z.record(z.number(), SectionSchema);

export type TimeType = z.infer<typeof TimeSchema>;
export type RatingType = z.infer<typeof RatingSchema>;
export type LecLabType = z.infer<typeof LecLabSchema>;
export type ViewDataType = z.infer<typeof ViewDataSchema>;
export type SectionType = z.infer<typeof SectionSchema>;
export type ProfessorsType = z.infer<typeof ProfessorsSchema>;
export type ColorsType = z.infer<typeof ColorsSchema>;
export type AllClassesType = z.infer<typeof AllClassesSchema>;
