import { createFileRoute } from "@tanstack/react-router";
import { SearchBar } from "src/components/root/editor/search/SearchBar";
import { z } from "zod";

export const Route = createFileRoute("/editor/search")({
  component: RouteComponent,
  validateSearch: z.object({ q: z.string().catch("") }),
});

function RouteComponent() {
  return (
    <div>
      <SearchBar />
    </div>
  );
}
