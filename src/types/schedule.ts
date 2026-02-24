import z from "zod";

export const SavedSection = z.object({
  sectionId: z.number(),
  colorIndex: z.number(),
});
export type SavedSection = z.infer<typeof SavedSection>;

export const EditorInViewParams = z.object({
  sections: z.array(SavedSection).catch([]),
  previewSectionId: z.number().optional(),
});
export type EditorInViewParams = z.infer<typeof EditorInViewParams>;
