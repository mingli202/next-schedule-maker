import type { RecordValues } from "@/types";

export const DataVersionCommit = {
  Fall2026: "a11fcec7b9150eb6f5b142260cc9f317e195285d",
} as const;
export const LatestVersionCommit = DataVersionCommit.Fall2026;

export type DataVersionCommit = RecordValues<typeof DataVersionCommit>;
