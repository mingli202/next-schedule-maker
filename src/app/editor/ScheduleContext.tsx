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
  localStorage.setItem("currentSchedule", JSON.stringify(updated));
  return updated;
}

const initalValue: SharedCurrentClasses[] = [];

function ScheduleContextProvider({ children }: Props) {
  const [currentClasses, dispatch] = useReducer(reducer, initalValue);
  const key = "currentSchedule";

  useLayoutEffect(() => {
    // TODO: remove this alert when done
    const id = setTimeout(() => {
      alert(
        "Please wait patiently as we are parsing the pdf and getting the data up to date",
      );
    }, 1000);

    const savedSchedule = localStorage.getItem(key);

    if (!savedSchedule) {
      localStorage.setItem(key, JSON.stringify([]));
    } else {
      dispatch({ type: "set", schedule: JSON.parse(savedSchedule) });
    }

    return () => clearTimeout(id);
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
