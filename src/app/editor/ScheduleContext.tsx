"use client";

import { SharedCurrentClasses, ActionType } from "@/types";
import React, { createContext, useLayoutEffect, useReducer } from "react";

export const ScheduleClassesContext = createContext<SharedCurrentClasses[]>([]);
export const ScheduleDispatchContext = createContext<
  React.Dispatch<ActionType>
>(() => {});

type Props = {
  children: React.ReactNode;
};

function reducer(currentClasses: SharedCurrentClasses[], action: ActionType) {
  let updated;
  switch (action.type) {
    case "add": {
      updated = [...currentClasses, action.cl];
      break;
    }
    case "delete": {
      updated = currentClasses.filter((cl) => cl.id !== action.id);
      break;
    }
    case "set": {
      updated = action.schedule;
      break;
    }
  }
  localStorage.setItem("currentScheduleFall", JSON.stringify(updated));
  return updated;
}

const initalValue: SharedCurrentClasses[] = [];

function ScheduleContextProvider({ children }: Props) {
  //alert(
  //  "The data will be updated for WINTER 2025 after I'm done with my finals (last day is December 19). I also plan on making a few changes such as removing the need to login to save schedules and save them locally on your browser. I promise I will update it at least one week before the first day of registration, so before December 27. Thanks for understanding!",
  //);

  const [currentClasses, dispatch] = useReducer(reducer, initalValue);
  const key = "currentScheduleFall";

  useLayoutEffect(() => {
    const savedSchedule = localStorage.getItem(key);

    if (!savedSchedule) {
      localStorage.setItem(key, JSON.stringify([]));
    } else {
      dispatch({ type: "set", schedule: JSON.parse(savedSchedule) });
    }
  }, []);

  return (
    <ScheduleClassesContext.Provider value={currentClasses}>
      <ScheduleDispatchContext.Provider value={dispatch}>
        {children}
      </ScheduleDispatchContext.Provider>
    </ScheduleClassesContext.Provider>
  );
}

export default ScheduleContextProvider;
