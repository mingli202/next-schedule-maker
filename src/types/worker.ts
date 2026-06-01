import type { SectionResponse } from "src/client";
import type { RecordValues, SectionStore } from ".";
import type { SavedSection, SearchSectionParams } from "./schedule";
import { Code } from "./autobuild";

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

export type WorkerResponseMap = {
  [WorkerMessageType.init]: undefined;
  [WorkerMessageType.miniGenerate]: {
    schedule: SavedSection[];
    index: number;
  };
  [WorkerMessageType.search]: {
    sections: SectionResponse[];
  };
  [WorkerMessageType.generate]: {
    schedules: SavedSection[][];
  };
};

export type WorkerResponse = WorkerResponseMap[WorkerMessageType];
