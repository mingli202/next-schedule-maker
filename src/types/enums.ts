import type { RecordValues } from "@/types";

export const DataVersionCommit = {
  Fall2026: "223da53964cb95211c69e6d1183ea14c1555371a",
} as const;
export const LatestVersionCommit = DataVersionCommit.Fall2026;

export type DataVersionCommit = RecordValues<typeof DataVersionCommit>;
