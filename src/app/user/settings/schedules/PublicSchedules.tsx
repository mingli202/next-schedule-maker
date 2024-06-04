"use client";

import { useState, useEffect, HTMLAttributes, useCallback } from "react";
import { Class, Saved } from "@/types";
import { getAuth } from "firebase/auth";
import { onValue, push, ref, remove, set } from "firebase/database";
import { app, db } from "@/backend";
import { cn } from "@/lib";
import SavedList from "@/app/components/SavedList";

type Schedule = Record<string, Saved>;

type Props = {
  allClasses: Record<string, Class>;
} & HTMLAttributes<HTMLDivElement>;

function PublicSchedules({ allClasses, className, ...props }: Props) {
  const [publicSchedules, setpublicSchedules] = useState<Schedule | null>(null);

  const [userSchedules, setuserSchedules] = useState<Schedule | null>(null);

  const dif = useCallback(
    (publicSch: Schedule | null, userSch: Schedule | null): Schedule | null => {
      if (!userSch) return null;
      if (!publicSch) return userSch;

      const publicIds = new Set(Object.values(publicSch).map((val) => val.id));

      return Object.fromEntries(
        Object.entries(userSch).filter(([id]) => !publicIds.has(id)),
      );
    },
    [],
  );

  useEffect(() => {
    const user = getAuth(app).currentUser;
    if (!user) return;

    const unsub = onValue(
      ref(db, `/public/users/${user.uid}/schedules`),
      (snap) => {
        setpublicSchedules(snap.val());
      },
    );

    const unsub1 = onValue(ref(db, `/users/${user.uid}/schedules`), (snap) => {
      setuserSchedules(snap.val());
    });

    return () => {
      unsub();
      unsub1();
    };
  }, []);

  return (
    <div
      className={cn(
        "flex gap-2 overflow-hidden",
        ...["flex-col"].map((c) => "max-md:" + c),
        className,
      )}
      {...props}
    >
      <div className="flex h-full basis-1/2 flex-col overflow-hidden rounded-md bg-bgSecondary p-2">
        <h2 className="shrink-0 text-base md:text-xl">Public</h2>
        <div className="flex basis-full flex-col overflow-hidden rounded-md bg-bgPrimary p-2">
          <SavedList
            savedSchedules={publicSchedules ?? {}}
            allClasses={allClasses}
            noEdit
            stateType="none"
            customSelect={async (id) => {
              const user = getAuth(app).currentUser;
              if (!user) return;
              await remove(
                ref(db, `/public/users/${user.uid}/schedules/${id}`),
              );
            }}
          />
        </div>
      </div>
      <div className="flex h-full basis-1/2 flex-col overflow-hidden rounded-md bg-bgSecondary p-2">
        <h2 className="shrink-0 text-base md:text-xl">Private</h2>
        <div className="flex basis-full flex-col overflow-hidden rounded-md bg-bgPrimary p-2">
          <SavedList
            savedSchedules={dif(publicSchedules, userSchedules) ?? {}}
            allClasses={allClasses}
            stateType="none"
            customSelect={async (id, s) => {
              const user = getAuth(app).currentUser;
              if (!user) return;
              await set(push(ref(db, `/public/users/${user.uid}/schedules`)), {
                ...s,
                id,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PublicSchedules;
