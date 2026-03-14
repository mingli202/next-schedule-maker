import z from "zod";

export const SavedSection = z.object({
  sectionId: z.number(),
  colorIndex: z.number(),
});
export type SavedSection = z.infer<typeof SavedSection>;

export const EditorInViewParams = z.object({
  sections: z.array(SavedSection).catch([]),
  previewSectionId: z.number().optional(),
  activeSearch: z.boolean().optional(),
});
export type EditorInViewParams = z.infer<typeof EditorInViewParams>;

export const SearchSectionParams = z.object({
  q: z.string().optional(),
  course: z.string().optional(),
  domain: z.string().optional(),
  code: z.string().optional(),
  title: z.string().optional(),
  prof: z.string().optional(),
  ratingMin: z.number().optional(),
  ratingMax: z.number().optional(),
  scoreMin: z.number().optional(),
  scoreMax: z.number().optional(),
  daysOff: z.string().optional(),
  timeStart: z.string().optional(),
  timeEnd: z.string().optional(),
  blended: z.boolean().optional(),
  honours: z.boolean().optional(),
});

export type SearchSectionParams = z.infer<typeof SearchSectionParams>;
