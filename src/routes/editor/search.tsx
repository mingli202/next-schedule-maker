import { createFileRoute } from "@tanstack/react-router";
import { SearchBar } from "src/components/root/editor/search/SearchBar";
import { SearchResult } from "src/components/root/editor/search/SearchResult";
import { z } from "zod";

export const Route = createFileRoute("/editor/search")({
  component: RouteComponent,
  validateSearch: z.object({ q: z.optional(z.string().catch("")) }),
});

function RouteComponent() {
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <SearchBar />
      <SearchResult />
    </div>
  );
}
