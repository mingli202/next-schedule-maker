import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const EditorViewParams = z.array(
  z.object({
    sectionId: z.number(),
    colorIndex: z.string(),
  }),
);

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
  validateSearch: z.array(EditorViewParams).catch([]),
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/editor"!</div>;
}
