import { RecordValues } from "@/types";

export const DataFileVersion = {
  winter2026: {
    "Dec 11": "17da3c222d6be0aaaddbd4ab917c34c487e93fe7",
  },
} as const;

export const DataFilename = {
  scheduleOfClasses: "allClasses",
  colors: "colors",
  professors: "professors",
} as const;
export type DataFilename = RecordValues<typeof DataFilename>;
