"use client";

import { app, db } from "@/backend";
import { getAuth } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { createContext, useEffect, useState } from "react";
import { Saved, SharedCurrentClasses } from "@/types";

export const SchedulesContext = createContext<Saved[] | null>(null);
export const SetSchedulesContext = createContext<
  React.Dispatch<React.SetStateAction<Saved[] | null>>
>(() => {});
export const FollowingsContext = createContext<string[] | null>(null);

export const CurrentClassesContext = createContext<SharedCurrentClasses[]>([]);
export const SetCurrentClassesContext = createContext<
  React.Dispatch<React.SetStateAction<SharedCurrentClasses[]>>
>(() => {});

type Props = {
  children: React.ReactNode;
};

const ContextProvider = ({ children }: Props) => {
  const [savedSchedules, setSavedSchedules] = useState<Saved[] | null>(null);
  const [followings, setFollowings] = useState<string[] | null>(null);

  const [currentClasses, setCurrentClasses] = useState<SharedCurrentClasses[]>(
    [],
  );

  useEffect(() => {
    const user = getAuth(app).currentUser;
    if (!user) return;

    const detach1 = onValue(
      ref(db, `/users/${user.uid}/schedules`),
      (snapshot) => {
        setSavedSchedules(snapshot.val());
      },
    );

    const detach2 = onValue(
      ref(db, `/users/${user.uid}/followings`),
      (snapshot) => setFollowings(snapshot.val()),
    );

    return () => {
      detach1();
      detach2;
    };
  });

  // thanks react
  return (
    <CurrentClassesContext.Provider value={currentClasses}>
      <SetCurrentClassesContext.Provider value={setCurrentClasses}>
        <SchedulesContext.Provider value={savedSchedules}>
          <SetSchedulesContext.Provider value={setSavedSchedules}>
            <FollowingsContext.Provider value={followings}>
              {children}
            </FollowingsContext.Provider>
          </SetSchedulesContext.Provider>
        </SchedulesContext.Provider>
      </SetCurrentClassesContext.Provider>
    </CurrentClassesContext.Provider>
  );
};

export default ContextProvider;
