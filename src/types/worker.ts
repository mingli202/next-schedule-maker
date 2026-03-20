import type { SectionResponse } from "src/client";
import type { RecordValues, SectionStore } from ".";
import type { SavedSection, SearchSectionParams } from "./schedule";

export const WorkerMessageType = {
  init: "init",
  miniGenerate: "mini-generate",
  search: "search",
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
};

export type WorkerResponse = WorkerResponseMap[WorkerMessageType];
