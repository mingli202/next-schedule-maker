import { createFileRoute } from "@tanstack/react-router";
import { EditorInViewParams } from "@/types/schedule";

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
  return (
    <div className="text-text box-border flex w-screen gap-2 overflow-x-hidden overflow-y-auto p-2 text-sm max-md:flex-col md:h-screen md:overflow-hidden md:text-base">
      Hello "/editor"!
    </div>
  );
}
