import miniGenerate from "@/app/mini-generate";
import type { Class, SharedCurrentClasses } from "@/types";

export type WorkerRequest = {
  type: "mini-generate";
  allClasses: Record<string, Class>;
  index: number;
};

export type WorkerResponse = {
  schedule: SharedCurrentClasses[];
  index: number;
};

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { type } = e.data;

  if (type === "mini-generate") {
    const sch = miniGenerate(e.data.allClasses);

    self.postMessage({
      schedule: sch,
      index: e.data.index,
    } satisfies WorkerResponse);
  }
};
