import type { SectionResponse } from "@/client";
import { getAllSectionsAllGet } from "@/client";
import miniGenerate from "@/lib/mini-generate";
import type { SavedSection } from "@/types/schedule";

export type WorkerRequest = {
  type: "mini-generate";
  index: number;
};

export type WorkerResponse = {
  schedule: SavedSection[];
  index: number;
};

let allSections: SectionResponse[] | null = null;

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  if (!allSections) {
    console.log("fetching sections");
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
