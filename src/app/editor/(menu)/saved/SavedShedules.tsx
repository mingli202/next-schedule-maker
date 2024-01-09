"use client";

import { app, db } from "@/backend";
import { Class, Saved } from "@/types";
import { getAuth } from "firebase/auth";

import { useContext, useEffect, useState } from "react";
import { onValue, ref, set } from "firebase/database";
import ScheduleCard from "./ScheduleCard";
import { Button } from "@/ui";
import {
  ScheduleClassesContext,
  ScheduleDispatchContext,
} from "../../ScheduleContext";
import { AnimatePresence } from "framer-motion";

type Props = {
  allClasses: Record<string, Class>;
  colors: string[];
};

const SavedSchedules = ({ allClasses, colors }: Props) => {
  const [savedSchedules, setSavedSchedules] = useState<Saved[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const currentClasses = useContext(ScheduleClassesContext);
  const dispatch = useContext(ScheduleDispatchContext);

  const handleClick = async () => {
    if (!savedSchedules || !uid) return;

    let counter = savedSchedules.length ?? 0;

    do {
      counter += 1;
    } while (savedSchedules.map((s) => s.id).includes(counter));

    const scheduleToSave = currentClasses.map((cl) => allClasses[cl.id]);

    const dbRef = ref(db, `/users/${uid}/schedules`);
    await set(dbRef, [
      ...savedSchedules,
      {
        id: counter,
        data: scheduleToSave,
        name: `Untitled ${counter}`,
      },
    ]).catch((err) => console.log(err));
  };

  useEffect(() => {
    const local = localStorage.getItem("dream-builder");
    if (local) {
      localStorage.removeItem("dream-builder");
    }

    const auth = getAuth(app);
    const user = auth.currentUser;
    if (!user) {
      return;
    }

    setUid(user.uid);

    const schedulesRef = ref(db, `/users/${user.uid}/schedules`);

    const unsub = onValue(schedulesRef, async (snapshot) => {
      if (!snapshot.exists()) {
        setSavedSchedules([]);
        return;
      }

      const value = snapshot.val() as Saved[];
      setSavedSchedules(value);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col gap-2">
      <div className="flex w-full shrink-0 justify-center pt-2">
        <Button
          variant="special"
          className="w-fit text-sm"
          onClick={handleClick}
          disableScaleEffect
        >
          Save Current Schedule
        </Button>
      </div>

      <div className="basis-full overflow-y-auto overflow-x-hidden">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-1">
          <div className="col-span-full h-0 bg-transparent" />
          <AnimatePresence>
            {savedSchedules.map((sch) => {
              return (
                <ScheduleCard
                  schedule={sch}
                  key={sch.id}
                  allClasses={allClasses}
                  colors={colors}
                  uid={uid}
                  savedSchedules={savedSchedules}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="shrink-0 basis-1/3 overflow-y-auto overflow-x-hidden">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-1 text-sm">
          <div className="col-span-full flex h-fit gap-2 rounded-md bg-bgSecondary p-2">
            <p className="basis-full">Course Count: {currentClasses.length}</p>

            <Button
              className="shrink-0 p-0"
              diasableBgEffect
              variant="basic"
              onClick={() => {
                dispatch({ type: "set", schedule: [] });
              }}
            >
              Clear
            </Button>
          </div>

          {currentClasses.map((cl, i) => {
            const c = allClasses[cl.id];
            return (
              <div
                key={cl.id + `${i}`}
                className="cursor-pointer rounded-md p-1"
                style={{
                  backgroundColor: cl.bgColor,
                  color: cl.textColor,
                }}
                onClick={() =>
                  dispatch({
                    type: "delete",
                    id: cl.id,
                  })
                }
              >
                <p className="font-bold">
                  {c.code} {c.lecture.title}
                </p>
                <p className="">
                  {c.section} {c.lecture.prof}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SavedSchedules;
