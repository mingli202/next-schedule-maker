import { createContext, ReactNode, useRef } from "react";
import {
  createScheduleStore,
  type ScheduleStore,
} from "src/lib/schedule/scheduleStore";

export const ScheduleContext = createContext<ScheduleStore | null>(null);

export function ScheduleContextProvider({ children }: { children: ReactNode }) {
  const store = useRef(createScheduleStore([]));

  return (
    <ScheduleContext.Provider value={store.current}>
      {children}
    </ScheduleContext.Provider>
  );
}
