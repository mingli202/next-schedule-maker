import z from "zod";

export const Time = z.record(z.string(), z.array(z.string()));

export type Time = z.infer<typeof Time>;

export const Rating = z.object({
  score: z.number(),
  avg: z.number(),
  nRating: z.number(),
  takeAgain: z.number(),
  difficulty: z.number(),
  status: z.literal(["found", "foundn't"]),
  prof: z.string(),
  pId: z.union([z.string(), z.null()]),
});
export type Rating = z.infer<typeof Rating>;

export const LecLab = z.object({
  title: z.string(),
  type: z.union([z.literal(["lecture", "laboratory"]), z.null()]),
  prof: z.string(),
  time: Time,
});
export type LecLab = z.infer<typeof LecLab>;

export const ViewData = z.array(z.record(z.string(), z.array(z.number())));

export type ViewData = z.infer<typeof ViewData>;

export const Section = z.object({
  id: z.number(),
  course: z.string(),
  section: z.string(),
  domain: z.string(),
  code: z.string(),
  title: z.string(),
  times: z.array(LecLab),
  more: z.string(),
  viewData: ViewData,
});
export type Section = z.infer<typeof Section>;

export const ColumnsXs = z.object({
  section: z.number(),
  disc: z.number(),
  courseNumber: z.number(),
  courseTitle: z.number(),
  day: z.number(),
  time: z.number(),
});
export type ColumnsXs = z.infer<typeof ColumnsXs>;

export const Word = z.object({
  pageNumber: z.number(),
  text: z.string(),
  x0: z.number(),
  top: z.number(),
  doctop: z.number(),
});
export type Word = z.infer<typeof Word>;
