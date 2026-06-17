import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { SectionByIdSchema, SectionStore } from "src/types";
import { type DataVersionCommit, LatestVersionCommit } from "src/types/enums";
import { GlobalAllSections, type SectionsDiff } from "src/types/generated";

export const allSectionsQueryOptions = (
  commit: DataVersionCommit = LatestVersionCommit,
) =>
  queryOptions({
    queryKey: ["section-store", commit],
    queryFn: () => fetchStore(commit),
    staleTime: Infinity,
  });

export function useSectionStore(
  commit: DataVersionCommit = LatestVersionCommit,
) {
  const { data } = useSuspenseQuery(allSectionsQueryOptions(commit));
  return data;
}

export async function fetchStore(
  _commit: DataVersionCommit,
): Promise<SectionStore> {
  // const res = await fetch(
  //   `https://raw.githubusercontent.com/mingli202/scraper/refs/heads/${commit}/all_sections_final.json`,
  // );
  const res = await fetch(
    "https://raw.githubusercontent.com/mingli202/scraper/refs/heads/diff/all_sections_final.json",
  );

  let sectionsMap: SectionByIdSchema = {};
  let semester = "";
  let filename = "";
  let sectionsDiff: SectionsDiff = {
    previousSectionsChanged: [],
    sectionsAdded: [],
    sectionsRemoved: [],
  };

  if (res.ok) {
    try {
      const json = await res.json();
      const globalAllSections = GlobalAllSections.parse(json);

      semester = globalAllSections.semester;
      filename = globalAllSections.filename;
      sectionsDiff = globalAllSections.sectionsDiff;
      sectionsMap = globalAllSections.sectionsById;
    } catch (e) {
      console.error("Failed to parse sections data: ", e);
    }
  } else {
    console.error("Failed to fetch from github");
  }

  const sections = Object.entries(sectionsMap);

  const sectionsById = new Map(sections);

  const professors = new Set(
    sections
      .flatMap(([_, section]) => section.leclabs.map((leclab) => leclab.prof))
      .filter((prof) => prof.trim() !== ""),
  );

  const codes = new Set(
    sections
      .map(([_, section]) => section.code)
      .filter((code) => code.trim() !== ""),
  );

  return {
    semester,
    filename,
    sectionsDiff,
    sectionsById,
    professors,
    codes,
  } satisfies SectionStore;
}
