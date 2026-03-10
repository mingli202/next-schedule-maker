import type { SectionResponse } from "src/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import isValidAdditionToSchedule from "./schedule/isValidAdditionToSchedule";

type ScheduleState = {
  sections: SectionResponse[];
};

type ScheduleAction = {
  set: (sections: SectionResponse[]) => boolean;
  add: (section: SectionResponse) => boolean;
  remove: (sectionId: number) => boolean;
};

type ScheduleStore = ScheduleState & ScheduleAction;

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      sections: [],
      set: (sections) => {
        set({ sections });
        return true;
      },
      add: (section) => {
        if (!isValidAdditionToSchedule(section, get().sections)) {
          return false;
        }

        set((state) => ({ sections: [...state.sections, section] }));
        return true;
      },
      remove: (sectionId: number) => {
        if (!get().sections.some((section) => section.id === sectionId)) {
          return false;
        }

        set((state) => ({
          sections: state.sections.filter(
            (section) => section.id !== sectionId,
          ),
        }));
        return true;
      },
    }),
    {
      name: "schedule-store",
    },
  ),
);
