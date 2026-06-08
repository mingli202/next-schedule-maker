import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SectionByIdSchema, type SectionStore } from "src/types";

export const allSectionsQueryOptions = queryOptions({
  queryKey: ["section-store"],
  queryFn: () => fetchStore(),
  staleTime: Infinity,
});

export function useSectionStore() {
  const { data } = useSuspenseQuery(allSectionsQueryOptions);
  return data;
}

export async function fetchStore(): Promise<SectionStore> {
  const res = await fetch(
    "https://raw.githubusercontent.com/mingli202/scraper/refs/heads/main/data/RPHOR200_-_Schedule_of_classes_June_5/all_sections_final.json",
  );

  let sectionsMap: SectionByIdSchema = {};

  if (res.ok) {
    try {
      const json = await res.json();
      sectionsMap = SectionByIdSchema.parse(json);
    } catch {}
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
    sectionsById,
    professors,
    codes,
  } as const;
}
