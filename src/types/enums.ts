import type { RecordValues } from "@/types";

export const DataVersionCommit = {
  Fall2026: "812acb74cd61edd4ec58a437b7abc5f7e60aff73",
} as const;
export const LatestVersionCommit = DataVersionCommit.Fall2026;

export type DataVersionCommit = RecordValues<typeof DataVersionCommit>;
