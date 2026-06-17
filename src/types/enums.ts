import type { RecordValues } from "@/types";

export const DataVersionCommit = {
  Fall2026: "8394a819ab28d04e3c89e020338a1848a0f96775",
} as const;
export const LatestVersionCommit = DataVersionCommit.Fall2026;

export type DataVersionCommit = RecordValues<typeof DataVersionCommit>;
