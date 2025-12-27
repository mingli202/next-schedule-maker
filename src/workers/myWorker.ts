import miniGenerate from "@/app/mini-generate";
import type { Class, SharedCurrentClasses } from "@/types";

export type WorkerRequest = {
  type: "mini-generate";
  allClasses: Record<string, Class>;
};

export type WorkerResponse = {
  schedule: SharedCurrentClasses[];
};

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const { type } = e.data;

  if (type === "mini-generate") {
    const sch = miniGenerate(e.data.allClasses);

    self.postMessage({ schedule: sch } satisfies WorkerResponse);
  }
};
