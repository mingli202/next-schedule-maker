import { createFileRoute } from "@tanstack/react-router";

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
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/editor"!</div>;
}
