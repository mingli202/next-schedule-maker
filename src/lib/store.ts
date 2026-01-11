import { ScheduleOfClasses, ScheduleOfClassesData } from "@/types/schedule";
import { createStore } from "zustand/vanilla";

export type StoreState = {
  scheduleOfClassesCache: Record<string, ScheduleOfClasses>;
};

export type StoreActions = {
  addScheduleOfClassesCache: (data: ScheduleOfClassesData) => void;
};

export type Store = StoreState & StoreActions;

export function createAppStore() {
  return createStore<StoreState>()((set) => ({
    scheduleOfClassesCache: {},

    addScheduleOfClassesCache: (data: ScheduleOfClassesData) =>
      set((state) => ({
        scheduleOfClassesCache: {
          ...state.scheduleOfClassesCache,
          [data.commitId]: data.scheduleOfClasses,
        },
      })),
  }));
}
