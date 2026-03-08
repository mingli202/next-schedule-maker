import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Eye, Minus, Plus } from "lucide-react";
import type { MouseEvent } from "react";
import { Virtuoso } from "react-virtuoso";
import type { SectionResponse } from "src/client";
import Button from "src/components/Button";
import SectionCard from "src/components/SectionCard";
import { useSectionQuery } from "src/hooks/useSection";
import { useSectionInSearchHelper } from "src/hooks/useSectionInSearchHelper";
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
  const navigate = useNavigate({ from: "/editor/search" });

  const onHover = (sectionId: number) => {
    return (_e: MouseEvent<HTMLDivElement>) => {
      navigate({
        search: (prev) => ({
          ...prev,
          previewSectionId:
            prev.previewSectionId === undefined ? undefined : sectionId,
        }),
      });
    };
  };

  return (
    <Virtuoso
      style={{ height: "100%" }}
      data={sections}
      itemContent={(index, section) => (
        <SectionCard
          section={section}
          className={cn(index !== 0 && "mt-2")}
          footer={<SectionCardFooter sectionId={section.id} />}
          onMouseEnter={onHover(section.id)}
          onMouseLeave={onHover(-1)}
        />
      )}
    />
  );
}

function SectionCardFooter(props: { sectionId: number }) {
  const { sectionId } = props;

  const { addSection, canAddSection, isSectionIncluded, removeSection } =
    useSectionInSearchHelper(sectionId);

  return (
    <div className="flex w-full justify-end">
      <Link
        to="."
        search={(prev) => ({
          ...prev,
          previewSectionId:
            prev.previewSectionId === undefined ? sectionId : undefined,
        })}
      >
        <Button variant="basic">
          <Eye className="h-5" />
        </Button>
      </Link>
      {canAddSection() ? (
        <Button variant="basic" onClick={addSection}>
          <Plus className="h-5" />
        </Button>
      ) : isSectionIncluded() ? (
        <Button variant="basic" onClick={removeSection}>
          <Minus className="h-5" />
        </Button>
      ) : null}
    </div>
  );
}
