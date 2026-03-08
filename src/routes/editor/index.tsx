import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/editor/")({
  component: RouteComponent,
  beforeLoad: () => {
    throw Route.redirect({ to: "./search", search: true });
  },
});

function RouteComponent() {
  return <Navigate to="/editor/search" search={{ sections: [] }} />;
}
