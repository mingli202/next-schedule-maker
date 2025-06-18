import { RecordValues } from ".";

const currentSemester = "fall2025";

export const SemesterNames = {
  Current: `${currentSemester}`,
  SessionStorage: {
    blablabla: "asdf",
  },
  LocalStorage: {
    blablabla: "asdf",
  },
} as const;

export type SemesterNames = RecordValues<typeof SemesterNames>;
