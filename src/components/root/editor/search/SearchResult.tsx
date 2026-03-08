import { useSearch } from "@tanstack/react-router";
import { Virtuoso } from "react-virtuoso";
import type { SectionResponse } from "src/client";
import SectionCard from "src/components/SectionCard";
import { useSectionQuery } from "src/hooks/useSection";
import { cn } from "src/lib/utils";

export function SearchResult() {
  const search = useSearch({ from: "/editor/search" });
  const q = search.q;

  const { data: sections, isPending } = useSectionQuery({ q });

  if (isPending) {
    return null;
  }

  return (
    <div className="flex-1">
      {!sections || sections.length === 0 ? (
        <NoResult />
      ) : (
        <Result sections={sections} />
      )}
    </div>
  );
}

function NoResult() {
  return null;
}

type ResultProps = {
  sections: SectionResponse[];
};
function Result({ sections }: ResultProps) {
  return (
    <Virtuoso
      style={{ height: "100%" }}
      data={sections}
      itemContent={(index, section) => (
        <SectionCard section={section} className={cn(index !== 0 && "mt-2")} />
      )}
    />
  );
}
