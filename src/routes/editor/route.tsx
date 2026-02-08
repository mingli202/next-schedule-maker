import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

export const EditorInViewParams = z.object({
  sections: z
    .array(
      z.object({
        sectionId: z.number(),
        colorIndex: z.number(),
      }),
    )
    .catch([]),
  previewSectionId: z.number().optional(),
});
export type EditorInViewParams = z.infer<typeof EditorInViewParams>;

export const Route = createFileRoute("/editor")({
  head: () => ({
    meta: [
      { title: "Editor" },
      {
        name: "description",
        content:
          "John Abbott College (JAC) Dream Schedule Builder Editor. A visual interface to add and generate schedules that fits your needs.",
      },
    ],
  }),
  validateSearch: EditorInViewParams,
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/editor"!</div>;
}
