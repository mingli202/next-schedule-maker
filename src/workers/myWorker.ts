import type { WorkerMessage, WorkerResponse } from "src/types/worker";
import { getAllSectionsAllGet, type SectionResponse } from "@/client";
import { client } from "@/client/client.gen";
import miniGenerate from "@/lib/mini-generate";

let allSections: SectionResponse[] | null = null;

const baseUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";
client.setConfig({ baseUrl });

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  if (!allSections) {
    const res = await getAllSectionsAllGet();

    if (!res.data) return;

    allSections = res.data;
  }

  const { type } = e.data;

  switch (type) {
    case "mini-generate": {
      const sch = miniGenerate(allSections);

      self.postMessage({
        schedule: sch,
        index: e.data.index,
      } satisfies WorkerResponse);
    }
  }
};
