import type { SectionStore } from "src/types";
import type {
  WorkerMessage,
  WorkerResponse,
  WorkerResponseMap,
} from "src/types/worker";
import { client } from "@/client/client.gen";
import miniGenerate from "@/lib/mini-generate";

let sectionStore: SectionStore | null = null;

const baseUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";
client.setConfig({ baseUrl });

function messageHandler(
  e: MessageEvent<WorkerMessage>,
): WorkerResponse | undefined {
  const data = e.data;

  switch (data.type) {
    case "init": {
      sectionStore = data.sectionStore;
      break;
    }
    case "mini-generate": {
      if (!sectionStore) {
        return;
      }

      const sch = miniGenerate(Object.values(sectionStore.sectionsById));

      return {
        schedule: sch,
        index: data.index,
      } satisfies WorkerResponseMap[typeof data.type];
    }
  }
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  console.log("message received");

  const res = messageHandler(e);

  if (res !== undefined) {
    self.postMessage(res);
  }
};
