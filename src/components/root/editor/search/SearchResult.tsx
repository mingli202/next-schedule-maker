import { useSearch } from "@tanstack/react-router";
import { useSectionQuery } from "src/hooks/useSection";

export function SearchResult() {
  const search = useSearch({ from: "/editor/search" });
  const q = search.q;

  const { data: result } = useSectionQuery({ q });

  return <div className="flex-1"></div>;
}
