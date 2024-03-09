"use client";

import { app, db } from "@/backend";
import { Class, Saved } from "@/types";
import { getAuth } from "firebase/auth";

import { useContext, useEffect, useState } from "react";
import { onValue, push, ref, set } from "firebase/database";

import { Button } from "@/ui";
import {
  ScheduleClassesContext,
  ScheduleDispatchContext,
} from "../../ScheduleContext";

import SavedList from "../../../components/SavedList";

type Props = {
  allClasses: Record<string, Class>;
};

const SavedSchedules = ({ allClasses }: Props) => {
  const [savedSchedules, setSavedSchedules] = useState<Record<string, Saved>>();
  const currentClasses = useContext(ScheduleClassesContext);
  const dispatch = useContext(ScheduleDispatchContext);

  const handleClick = async () => {
    const user = getAuth(app).currentUser;

    if (!user) return;

    const newSchedule = {
      data: currentClasses,
      name: `Untitled`,
      semester: "fall 2024",
      public: false,
    } as const;

    await set(push(ref(db, `/users/${user.uid}/schedules`)), newSchedule).catch(
      (err) => console.log(err),
    );
  };

  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (!user) {
      return;
    }

    const schedulesRef = ref(db, `/users/${user.uid}/schedules`);

    const unsub = onValue(schedulesRef, async (snapshot) => {
      if (!snapshot.exists()) {
        setSavedSchedules(undefined);
        return;
      }

      const value = snapshot.val() as Record<string, Saved>;
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

      <SavedList
        savedSchedules={savedSchedules ?? {}}
        allClasses={allClasses}
        stateType={{
          type: "dispatch",
          dispatch: dispatch,
        }}
      />

      <div className="shrink-0 basis-1/3 overflow-y-auto overflow-x-hidden">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-1 text-sm">
          <div className="col-span-full flex h-fit gap-2 rounded-md bg-bgSecondary p-2">
            <p className="basis-full">Course Count: {currentClasses.length}</p>

            <Button
              className="shrink-0 p-0"
              disableBgEffect
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
