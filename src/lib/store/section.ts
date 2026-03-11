import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getAllSectionsAllGet } from "src/client";
import type { SectionStore } from "src/types";

export const allSectionsQueryOptions = queryOptions({
  queryKey: ["section-store"],
  queryFn: async (): Promise<SectionStore> => {
    const res = await getAllSectionsAllGet();
    const sections = res.data ?? [];

    const sectionsById = Object.fromEntries(
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
  },
  staleTime: Infinity,
});

export function useSectionStore() {
  const { data } = useSuspenseQuery(allSectionsQueryOptions);
  return data;
}
