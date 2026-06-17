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
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import Button from "src/components/Button";
import SectionCard from "src/components/SectionCard";
import { useSectionInSearchHelper } from "src/hooks";
import { onWorkerMessage, postWorkerMessage } from "src/lib/store/worker";
import { cn } from "src/lib/utils";
import type { Section } from "src/types/generated";

export function SearchResult() {
  const search = useSearch({
    from: "/editor/search",
    select: (search) => ({
      q: search.q,
      course: search.course,
      domain: search.domain,
      code: search.code,
      title: search.title,
      prof: search.prof,
      ratingMin: search.ratingMin,
      ratingMax: search.ratingMax,
      scoreMin: search.scoreMin,
      scoreMax: search.scoreMax,
      daysOff: search.daysOff,
      timeStart: search.timeStart,
      timeEnd: search.timeEnd,
      blended: search.blended,
      honours: search.honours,
      sections: search.sections,
      excludeInvalid: search.excludeInvalid,
    }),
  });

  const [results, setResults] = useState<Section[]>([]);
  const isFirstLoading = useRef(true);

  useEffect(() => {
    const unsub = onWorkerMessage("search", (e) => {
      isFirstLoading.current = false;
      setResults(e.sections);
    });

    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    postWorkerMessage({
      type: "search",
      search: {
        ...search,
        sections: search.excludeInvalid ? search.sections : undefined,
      },
    });
  }, [search]);

  if (isFirstLoading.current) {
    return null;
  }

  return <Result sections={results} />;
}

function NoResult() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h3 className="font-heading text-center text-xl">Guidelines</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 shrink-0" /> General search
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 shrink-0" /> Advanced filtering
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 shrink-0" /> Generate schedules
        </div>
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 shrink-0" /> Your saved schedules
        </div>
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 shrink-0" /> Some options
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
        schedule. It is NOT an official website and you still need to make your
        schedule via OMNIVOX. Moreover, although I try my best to make the
        website as reliable as possible, it is still your responsibility to make
        sure that the info is correct.
      </p>
      <div className="bg-secondary h-0.5 w-full rounded-full" />
      <div className="flex flex-col gap-2">
        <a
          href="https://github.com/mingli202/next-schedule-maker"
          className="group flex items-center gap-2"
          target="_blank"
          rel="noreferrer"
        >
          <Github className="h-4 w-4 shrink-0" />
          <span className="group-hover:underline">Contribute</span>
        </a>
        <a
          href="https://mingliliu.com"
          className="group flex items-center gap-2"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://avatars.githubusercontent.com/u/126989125?v=4"
            alt="portfolio icon"
            className="h-4 w-4 shrink-0 rounded-full"
          />
          <span className="group-hover:underline">
            Ming Li Liu, 2022-2024 Honours Science
          </span>
        </a>
      </div>
    </div>
  );
}

const MemoizedSectionCard = memo(
  ({
    onHover,
    section,
    index,
  }: {
    onHover: (sectionId: string) => void;
    index: number;
    section: Section;
  }) => {
    const mouseOver = useRef(false);

    return (
      <div className={cn(index !== 0 && "pt-2")}>
        <SectionCard
          section={section}
          footer={<SectionCardFooter sectionId={section.id} />}
          onMouseEnter={() => {
            if (mouseOver.current) {
              return;
            }
            mouseOver.current = true;
            return onHover(section.id);
          }}
          onMouseOver={() => {
            if (mouseOver.current) {
              return;
            }
            mouseOver.current = true;
            return onHover(section.id);
          }}
          onMouseLeave={() => {
            mouseOver.current = false;
            return onHover("none");
          }}
        />
      </div>
    );
  },
);

type ResultProps = {
  sections: Section[];
};
const Result = memo(
  ({ sections }: ResultProps) => {
    const navigate = useNavigate({ from: "/editor/search" });

    const onHover = useCallback(
      (sectionId: string) => {
        navigate({
          to: ".",
          search: (prev) => ({
            ...prev,
            previewSectionId:
              prev.previewSectionId === undefined ? undefined : sectionId,
          }),
        });
      },
      [navigate],
    );

    const components = useMemo(
      () => ({
        EmptyPlaceholder: () => <NoResult />,
      }),
      [],
    );

    return (
      <div className="flex-1 overflow-hidden">
        <Virtuoso
          components={components}
          style={{ overflowX: "hidden", width: "100%" }}
          data={sections}
          computeItemKey={(_, section) => section.id}
          overscan={200}
          itemContent={(index, section) => (
            <MemoizedSectionCard
              section={section}
              index={index}
              onHover={onHover}
            />
          )}
        />
      </div>
    );
  },
  (prevProps, newProps) =>
    prevProps.sections.length === newProps.sections.length &&
    newProps.sections.every(
      (section, index) => prevProps.sections[index].id === section.id,
    ),
);

const SectionCardFooter = memo((props: { sectionId: string }) => {
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
        <Button variant="basic" title="toggle preview">
          <Eye className="h-5" />
        </Button>
      </Link>
      {canAddSection() ? (
        <Button variant="basic" onClick={addSection} title="add">
          <Plus className="h-5" />
        </Button>
      ) : isSectionIncluded() ? (
        <Button variant="basic" onClick={removeSection} title="remove">
          <Minus className="h-5" />
        </Button>
      ) : null}
    </div>
  );
});
