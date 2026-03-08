import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/editor/filter")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/editor/filter"!</div>;
}
