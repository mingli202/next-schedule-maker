"use client";

import { app, db } from "@/backend";
import { SharedCurrentClasses, ActionType } from "@/types";
import { getAuth } from "firebase/auth";
import { ref, update } from "firebase/database";
import React, { createContext, useEffect, useReducer } from "react";

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
    case "set": {
      return action.schedule;
    }
  }
};

const initalValue: SharedCurrentClasses[] = [];

const ScheduleContextProvider = ({ children }: Props) => {
  const [currentClasses, dispatch] = useReducer(reducer, initalValue);

  useEffect(() => {
    const user = getAuth(app).currentUser;
    if (!user) return;
    update(ref(db, `/users/${user.uid}`), {
      lastSignedIn: new Date().toString() + " on Dream Builder",
    }).catch(() => alert("Error setting data."));
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
