"use client";

import { SharedCurrentClasses, ActionType } from "@/types";
import React, { createContext, useReducer } from "react";

export const ScheduleClassesContext = createContext<SharedCurrentClasses[]>([]);
export const ScheduleDispatchContext = createContext<
  React.Dispatch<ActionType>
>(() => {});

type Props = {
  children: React.ReactNode;
};

const reducer = (
  currentClasses: SharedCurrentClasses[],
  action: ActionType,
) => {
  switch (action.type) {
    case "add": {
      return [...currentClasses, action.cl];
    }
    case "delete": {
      return currentClasses.filter((cl) => cl.id !== action.id);
    }
  }
};

const initalValue: SharedCurrentClasses[] = [];

const ScheduleContextProvider = ({ children }: Props) => {
  const [currentClasses, dispatch] = useReducer(reducer, initalValue);

  return (
    <ScheduleClassesContext.Provider value={currentClasses}>
      <ScheduleDispatchContext.Provider value={dispatch}>
        {children}
      </ScheduleDispatchContext.Provider>
    </ScheduleClassesContext.Provider>
  );
};

export default ScheduleContextProvider;
