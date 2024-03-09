"use client";

import { Dispatch, SetStateAction, createContext, useState } from "react";
import { SharedCurrentClasses } from "@/types";

export const ScheduleClassesContext = createContext<SharedCurrentClasses[]>([]);
export const SetScheduleContext = createContext<
  Dispatch<SetStateAction<SharedCurrentClasses[]>>
>(() => {});

type Props = {
  children: React.ReactNode;
};

const ContextProvider = ({ children }: Props) => {
  const [currentClasses, setCurrentClasses] = useState<SharedCurrentClasses[]>(
    [],
  );

  return (
    <ScheduleClassesContext.Provider value={currentClasses}>
      <SetScheduleContext.Provider value={setCurrentClasses}>
        {children}
      </SetScheduleContext.Provider>
    </ScheduleClassesContext.Provider>
  );
};

export default ContextProvider;
