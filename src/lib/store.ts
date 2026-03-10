import { create } from "zustand";

type WorkerStore = {
  worker: Worker;
};

export const useWorker = create<WorkerStore>(() => ({
  worker: new Worker(new URL("../workers/myWorker.ts", import.meta.url), {
    type: "module",
  }),
}));
