import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  Eye,
  Filter,
  Folder,
  Github,
  Info,
  Minus,
  Plus,
  Search,
  Settings,
  Star,
} from "lucide-react";
import { MouseEvent, useCallback } from "react";
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

  return !sections || sections.length === 0 ? (
    <NoResult />
  ) : (
    <Result sections={sections} />
  );
}

function NoResult() {
  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto">
      <div className="flex flex-col gap-4 p-4">
        <h3 className="font-heading text-center text-xl">Guidelines</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Search className="h-4 shrink-0" /> General search
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 shrink-0" /> Advanced filtering
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 shrink-0" /> Generate an exhaustive list of
            candidate schedule
          </div>
          <div className="flex items-center gap-2">
            <Folder className="h-4 shrink-0" /> Your saved schedules
          </div>
          <div className="flex items-center gap-2">
            <Settings className="h-4 shrink-0" /> Some options
          </div>
        </div>
        <div className="bg-secondary h-0.5 w-full rounded-full" />
        <div className="">
          Search by keywords and separate them by a comma. It will attempt to
          search by matching various patterns. Click on the{" "}
          <Info className="inline h-4" /> icon right to the search bar for more
          detail. Examples:
        </div>
        <ul className="list-inside list-disc">
          <li>ENGLISH, 603-200, r{">"}4.5, 10:00-16:00</li>
          <li>HUMA, blended, steven</li>
          <li>bio ii, s{">"}80, WF</li>
        </ul>
        <div className="bg-secondary h-0.5 w-full rounded-full" />
        <p>
          DISCLAIMER: This website is a tool meant to help students plan their
          schedule. It is NOT an official website and you still need to make
          your schedule via OMNIVOX. Moreover, although I try my best to make
          the website as reliable as possible, it is still your responsibility
          to make sure that the info is correct.
        </p>
        <div className="bg-secondary h-0.5 w-full rounded-full" />
        <a
          href="https://github.com/mingli202/next-schedule-maker"
          className="flex items-center gap-2"
        >
          <Github className="h-4 shrink-0" />
          Contribute
        </a>
      </div>
    </div>
  );
}

type ResultProps = {
  sections: SectionResponse[];
};
function Result({ sections }: ResultProps) {
  const navigate = useNavigate({ from: "/editor/search" });

  const onHover = useCallback(
    (sectionId: number) => () => {
      navigate({
        search: (prev) => ({
          ...prev,
          previewSectionId:
            prev.previewSectionId === undefined ? undefined : sectionId,
        }),
      });
    },
    [navigate],
  );

  return (
    <Virtuoso
      style={{ overflowX: "hidden", width: "100%", flexGrow: 1 }}
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
