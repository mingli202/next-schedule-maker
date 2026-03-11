import type { RecordValues, SectionStore } from ".";
import type { SavedSection } from "./schedule";

export const WorkerMessageType = {
  init: "init",
  miniGenerate: "mini-generate",
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
    };

export type WorkerResponseMap = {
  [WorkerMessageType.init]: undefined;
  [WorkerMessageType.miniGenerate]: {
    schedule: SavedSection[];
    index: number;
  };
};

export type WorkerResponse = WorkerResponseMap[WorkerMessageType];
