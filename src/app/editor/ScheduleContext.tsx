"use client";

import { SharedCurrentClasses, ActionType } from "@/types";
import React, {
  createContext,
  useEffect,
  useLayoutEffect,
  useReducer,
} from "react";

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
};

const initalValue: SharedCurrentClasses[] = [];

const ScheduleContextProvider = ({ children }: Props) => {
  const [currentClasses, dispatch] = useReducer(reducer, initalValue);
  const key = "currentSchedule";

  useLayoutEffect(() => {
    const savedSchedule = localStorage.getItem(key);
    console.log({ savedSchedule });

    if (!savedSchedule) {
      console.log("initial");
      localStorage.setItem(key, JSON.stringify([]));
    } else {
      console.log("set");
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
};

export default ScheduleContextProvider;
