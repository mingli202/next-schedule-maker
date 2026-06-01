import generate from "src/components/root/editor/autobuild/generate";
import { filterDown } from "src/lib/schedule/filterDown";
import type { SectionStore } from "src/types";
import type { WorkerMessage, WorkerResponse } from "src/types/worker";
import miniGenerate from "@/lib/mini-generate";

let sectionStore: SectionStore | null = null;

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

      const sch = miniGenerate(sectionStore.sectionsById);

      return {
        type: data.type,
        schedule: sch,
        index: data.index,
      };
    }
    case "search": {
      if (!sectionStore) {
        return {
          type: data.type,
          sections: [],
        };
      }

      const sections = filterDown(sectionStore, data.search);

      return {
        type: data.type,
        sections,
      };
    }
    case "generate": {
      if (!sectionStore) {
        return {
          type: data.type,
          schedules: [],
        };
      }

      const schedules = generate(
        data.codes,
        data.currentSections,
        data.useCurrent,
        data.dayOff,
        data.time,
        sectionStore.sectionsById,
      );

      return {
        type: data.type,
        schedules,
      };
    }
  }
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const res = messageHandler(e);

  if (res !== undefined) {
    self.postMessage(res);
  }
};
