import { z } from "zod/v4";

export const Time = z.record(
  z.enum(["M", "T", "W", "R", "F"]),
  z.array(z.string()),
);

export const Rating = z.object({
  score: z.number().min(0.0).max(100.0),
  avg: z.number().min(0.0).max(5.0),
  nRating: z.number().min(0.0),
  takeAgain: z.number().min(0.0).max(100.0),
  difficulty: z.number().min(0.0).max(5.0),
  status: z.enum(["foundn't", "found"]),
  prof: z.string(),
});

export const LecLab = z.object({
  title: z.string(),
  prof: z.string(),
  time: Time,
  rating: Rating.optional(),
});

export const ViewData = z.array(
  z.record(z.number().min(1).max(5), z.array(z.number().min(1).max(20))),
);

export const Section = z.object({
  program: z.string().regex(/[A-Z]+/),
  count: z.number(),
  section: z.string().regex(/^[0-9]{5}$/),
  course: z.string(),
  code: z.string().regex(/\w{3}-\w{3}-\w{1,2}/),
  lecture: LecLab.optional(),
  lab: LecLab.optional(),
  more: z.string(),
  viewData: ViewData,
});

export const Professors = z.array(z.string());
export const Colors = z.array(z.string());
export const AllClasses = z.record(z.number(), Section);

export type Time = z.infer<typeof Time>;
export type Rating = z.infer<typeof Rating>;
export type LecLab = z.infer<typeof LecLab>;
export type ViewData = z.infer<typeof ViewData>;
export type Section = z.infer<typeof Section>;
export type Professors = z.infer<typeof Professors>;
export type Colors = z.infer<typeof Colors>;
export type AllClasses = z.infer<typeof AllClasses>;
