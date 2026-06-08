import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SectionResponse } from "src/client";
import type { SectionStore } from "src/types";
import { zSectionResponse } from "src/types/client/zod.gen";
import { z } from "zod";

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

  let sections: SectionResponse[] = [];

  if (res.ok) {
    const json = await res.json();
    sections = z.array(zSectionResponse).parse(json);
  } else {
    console.error("Failed to fetch from github");
  }

  const sectionsById = new Map(
    sections.map((section) => [section.id, section] as const),
  );

  const professors = new Set(
    sections
      .flatMap((section) => section.leclabs.map((leclab) => leclab.prof))
      .filter((prof) => prof.trim() !== ""),
  );

  const codes = new Set(
    sections
      .map((section) => section.code)
      .filter((code) => code.trim() !== ""),
  );

  return {
    sectionsById,
    professors,
    codes,
  } as const;
}
