import type {
  WorkerMessage,
  WorkerResponse,
  WorkerResponseMap,
} from "src/types/worker";
import type { SectionResponse } from "@/client";
import { client } from "@/client/client.gen";
import miniGenerate from "@/lib/mini-generate";

let allSections: SectionResponse[] | null = null;

const baseUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";
client.setConfig({ baseUrl });

function messageHandler(
  e: MessageEvent<WorkerMessage>,
): WorkerResponse | undefined {
  const data = e.data;

  switch (data.type) {
    case "init": {
      allSections = data.allSections;
      break;
    }
    case "mini-generate": {
      if (!allSections) {
        return;
      }

      const sch = miniGenerate(allSections);

      return {
        schedule: sch,
        index: data.index,
      } satisfies WorkerResponseMap[typeof data.type];
    }
  }
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const res = messageHandler(e);

  if (res !== undefined) {
    self.postMessage(res);
  }
};
