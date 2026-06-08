import type { RecordValues, SectionStore } from ".";
import type { Code } from "./autobuild";
import type { Section } from "./generated";
import type { SavedSection, SearchSectionParams } from "./schedule";

export const WorkerMessageType = {
  init: "init",
  miniGenerate: "mini-generate",
  search: "search",
  generate: "generate",
} as const;

export type WorkerMessageType = RecordValues<typeof WorkerMessageType>;

export type WorkerMessage =
  | {
      type: "init";
      sectionStore: SectionStore;
    }
  | {
      type: "mini-generate";
      index: number;
    }
  | {
      type: "search";
      search: SearchSectionParams & { sections: SavedSection[] | undefined };
    }
  | {
      type: "generate";
      codes: Code[];
      currentSections: SavedSection[];
      useCurrent: boolean;
      dayOff: string[];
      time: [string, string];
    };

export type WorkerResponse =
  | {
      type: "mini-generate";
      schedule: SavedSection[];
      index: number;
    }
  | {
      type: "search";
      sections: Section[];
    }
  | {
      type: "generate";
      schedules: SavedSection[][];
    };

export type WorkerResponseOf<T extends WorkerResponse["type"]> = Extract<
  WorkerResponse,
  { type: T }
>;
