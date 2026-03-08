import {
  queryOptions,
  type UseQueryResult,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import {
  type GetSectionsSectionsGetData,
  getSectionSectionsSectionIdGet,
  getSectionsSectionsGet,
  type SectionResponse,
} from "@/client";

export function sectionOptions(sectionId: number) {
  return queryOptions({
    queryKey: ["section", sectionId],
    queryFn: async () => {
      const res = await getSectionSectionsSectionIdGet({
        path: { section_id: sectionId },
      });

      if (res.error) {
        throw new Error(JSON.stringify(res.error.detail));
      }

      return res.data;
    },
    staleTime: Infinity,
  });
}

export function useSection(sectionId: number) {
  const res = useQuery(sectionOptions(sectionId));

  if (res.isError) {
    console.trace(`Section ${sectionId} failed to load. Error ${res.error}`);
  }

  return res;
}

function combineFn(results: UseQueryResult<SectionResponse, Error>[]) {
  return {
    data: results.map((res) => res.data).filter((section) => !!section),
    isPending: results.some((res) => res.isPending),
  };
}

export function useSections(sectionIds: number[]) {
  const res = useQueries({
    queries: sectionIds.map((sectionId) => sectionOptions(sectionId)),
    combine: combineFn,
  });

  return res;
}

export function useSectionQuery(query: GetSectionsSectionsGetData["query"]) {
  const res = useQuery({
    queryKey: ["section_query", query],
    queryFn: async () => {
      const res = await getSectionsSectionsGet({ query });

      if (res.error) {
        throw new Error(JSON.stringify(res.error.detail));
      }

      return res.data;
    },
  });

  if (res.error) {
    console.trace(`query ${query} threw an error`);
  }

  return res;
}
