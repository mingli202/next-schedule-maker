import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/editor/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Navigate to="/editor/search" search={{ sections: [] }} />;
}
