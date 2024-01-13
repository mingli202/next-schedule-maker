"use client";

import { app, db } from "@/backend";
import { getAuth } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { createContext, useEffect, useState } from "react";
import { Saved, SharedCurrentClasses } from "@/types";

export const SchedulesContext = createContext<Saved[] | null>(null);
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
  const [friends, setFriends] = useState<string[] | null>(null);

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

    const detach2 = onValue(ref(db, `/users/${user.uid}/friends`), (snapshot) =>
      setFriends(snapshot.val()),
    );

    return () => {
      detach1();
      detach2;
    };
  });

  return (
    <CurrentClassesContext.Provider value={currentClasses}>
      <SetCurrentClassesContext.Provider value={setCurrentClasses}>
        <SchedulesContext.Provider value={savedSchedules}>
          <FollowingsContext.Provider value={friends}>
            {children}
          </FollowingsContext.Provider>
        </SchedulesContext.Provider>
      </SetCurrentClassesContext.Provider>
    </CurrentClassesContext.Provider>
  );
};

export default ContextProvider;
