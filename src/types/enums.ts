import type { RecordValues } from "@/types";

export const DataVersionCommit = {
  Fall2026: "main",
} as const;
export const LatestVersionCommit = DataVersionCommit.Fall2026;

export type DataVersionCommit = RecordValues<typeof DataVersionCommit>;
