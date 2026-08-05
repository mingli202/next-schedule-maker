import {
  queryOptions,
  type UseSuspenseQueryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { Id } from "convex/_generated/dataModel";
import type { SectionStore } from "src/types";
import { GlobalAllSections, Section } from "src/types/generated";
import { z } from "zod";
import { getSectionsDiff } from "../section-diff";
import { type DataSource, useDataSourceStore } from "./data-source";

export const SECTION_STORE_KEY = "section-store";

type SectionStoreQuery = UseSuspenseQueryOptions<
  // biome-ignore lint/suspicious/noExplicitAny: <why can't it resolve correctly>
  any,
  Error,
  SectionStore,
  // biome-ignore lint/suspicious/noExplicitAny: <query key type differs>
  any
>;

const sharedOptions = {
  staleTime: Infinity,
  gcTime: 0,
  retry: 5,
  retryDelay: (count: number) => {
    // exponential backoff + random jitter
    const baseDelay = 2 ** count;
    const jitter = (baseDelay * (Math.random() - 0.5)) / 5;
    return baseDelay + jitter;
  },
  structuralSharing: addDiff as (a: unknown, b: unknown) => SectionStore,
} as const;

/**
 * The query options
 * */
export const allSectionsQueryOptions = (
  source: DataSource = { type: "latest" },
): SectionStoreQuery => {
  if (source.type === "latest") {
    return queryOptions({
      queryKey: [SECTION_STORE_KEY, source.type],
      queryFn: ({ signal }) => fetchFromBackend(signal),
      ...sharedOptions,
      select: mapBackendOutput,
    });
  }

  return queryFromConvex(
    source.userUploadId,
    source.storageUrl,
    source.semester,
    source.displayName,
  );
};

/**
 * The section store
 * */
export function useSectionStore(): SectionStore {
  const source = useDataSourceStore((s) => s.dataSource);

  const { data } = useSuspenseQuery(allSectionsQueryOptions(source));
  return data;
}

/**
 * Fetch the global all sections from the backend
 * */
export async function fetchFromBackend(
  signal: AbortSignal,
): Promise<GlobalAllSections> {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/global-all-sections`,
    { signal },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch from backend", {
      cause: res.statusText,
    });
  }

  const json = await res.json();
  return GlobalAllSections.parse(json);
}

/**
 * returns the SectionStore from the given globalAllSections
 * */
function mapBackendOutput(globalAllSections: GlobalAllSections): SectionStore {
  const sections = Object.entries(globalAllSections.sectionsById);

  const sectionsById = new Map(sections);
  const professors = profsFromSections(sections);

  console.dir(globalAllSections.sectionsById);

  return {
    semester: globalAllSections.semester,
    filename: globalAllSections.filename,
    comments: globalAllSections.comments,
    sectionsDiff: globalAllSections.sectionsDiff ?? undefined,
    sectionsById,
    professors,
  } satisfies SectionStore;
}

/**
 * The convex query
 * */
function queryFromConvex(
  userUploadId: Id<"userUploads">,
  storageUrl: string,
  semester: string,
  displayName: string,
) {
  return queryOptions({
    queryKey: [SECTION_STORE_KEY, userUploadId],
    queryFn: ({ signal }) => fetchFromStorage(storageUrl, signal),
    ...sharedOptions,
    select: (d) => mapConvexOutput(d, semester, displayName),
  });
}

/**
 * fetch the sections from the storage url
 * */
async function fetchFromStorage(
  url: string,
  signal: AbortSignal,
): Promise<Record<string, Section>> {
  const res = await fetch(url, { signal });
  return z.record(z.string(), Section).parse(await res.json());
}

/**
 * The select function to convert it into a SectionStore
 * */
function mapConvexOutput(
  sectionsById: Record<string, Section>,
  semester: string,
  displayName: string,
): SectionStore {
  const sections = Object.entries(sectionsById);
  const sectionsByIdMap = new Map(sections);
  const professors = profsFromSections(sections);

  return {
    semester: semester,
    comments: [],
    filename: displayName,
    sectionsById: sectionsByIdMap,
    professors: professors,
  };
}

/**
 * returns set of unique profs from the given sections
 * */
function profsFromSections(sections: [string, Section][]): Set<string> {
  return new Set(
    sections
      .flatMap(([_, section]) => section.leclabs.map((leclab) => leclab.prof))
      .filter((prof) => prof.trim() !== ""),
  );
}

/**
 * add the diff to the new data
 * */
function addDiff(
  oldData: SectionStore | undefined,
  newData: SectionStore,
): SectionStore {
  if (!oldData) {
    return newData;
  }

  const sectionsDiff = getSectionsDiff(
    oldData.sectionsById,
    newData.sectionsById,
  );

  return {
    ...newData,
    sectionsDiff,
  };
}
