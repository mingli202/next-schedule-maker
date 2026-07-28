import { convexQuery } from "@convex-dev/react-query";
import {
  queryOptions,
  type UseSuspenseQueryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import type { Doc, Id } from "convex/_generated/dataModel";
import type { SectionStore } from "src/types";
import { GlobalAllSections, type Section } from "src/types/generated";
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
      queryFn: ({ signal }) => {
        return fetchStore(signal);
      },
      ...sharedOptions,
      select: mapBackendOutput,
    });
  }

  return queryFromConvex(source.id);
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
export async function fetchStore(
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

  return {
    ...globalAllSections,
    sectionsDiff: globalAllSections.sectionsDiff,
    sectionsById,
    professors,
  } satisfies SectionStore;
}

/**
 * The convex query
 * */
function queryFromConvex(uploadId: Id<"uploads">) {
  const convexOptions = convexQuery(api.uploads.queries.getUpload, {
    uploadId: uploadId,
  });
  const fn = convexOptions.queryFn;

  if (!fn) {
    throw new Error("query function can't be null");
  }

  return queryOptions({
    ...convexOptions,
    ...sharedOptions,
    queryFn: async (args) => {
      const data = await fn(args);
      if (!data) {
        throw new Error("could not find the upload");
      }

      return data;
    },
    select: mapConvexOutput,
  });
}

/**
 * The select function to convert it into a SectionStore
 * */
function mapConvexOutput(upload: Doc<"uploads">): SectionStore {
  const sectionsById = GlobalAllSections.def.shape.sectionsById.parse(
    upload.sectionsById,
  );
  const sections = Object.entries(sectionsById);
  const sectionsByIdMap = new Map(sections);
  const professors = profsFromSections(sections);

  return {
    semester: upload.semester,
    comments: [],
    filename: upload.filename,
    sectionsDiff: null,
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
