import type { RecordValues } from "@/types";

export const DataVersionCommit = {
  Fall2026: "70e98154773c0eadfa9a0d0bd62bf707b8f51f99",
} as const;
export const LatestVersionCommit = DataVersionCommit.Fall2026;

export type DataVersionCommit = RecordValues<typeof DataVersionCommit>;
