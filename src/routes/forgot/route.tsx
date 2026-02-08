import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forgot")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/forgot"!</div>;
}
