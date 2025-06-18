import { RecordValues } from ".";

const currentSemester = "fall2025";

export const SemesterNames = {
  current: `${currentSemester}`,
} as const;

export type SemesterNames = RecordValues<typeof SemesterNames>;
