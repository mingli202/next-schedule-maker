import type { SavedSection } from "./schedule";

export type WorkerMessage = {
  type: "mini-generate";
  index: number;
};

export type WorkerResponse = {
  schedule: SavedSection[];
  index: number;
};
