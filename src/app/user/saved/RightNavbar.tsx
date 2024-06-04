"use client";

import { cn } from "@/lib";
import { useContext, useEffect, useState } from "react";

import Link from "next/link";

import { getAuth } from "firebase/auth";
import { app, db } from "@/backend";
import { Class, Saved } from "@/types";
import { Button } from "@/ui";
import { onValue, ref } from "firebase/database";
import { SetScheduleContext } from "../Context";
import SavedList from "@/app/components/SavedList";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  allClasses: Record<string, Class>;
};

function RightNavbar({ className, allClasses, ...props }: Props) {
  const [schedules, setschedules] = useState<
    Record<string, Saved> | "loading" | undefined
  >("loading");

  const setCurrentClasses = useContext(SetScheduleContext);

  useEffect(() => {
    const user = getAuth(app).currentUser;
    if (!user) return;

    const unsub = onValue(ref(db, `/users/${user.uid}/schedules`), (snap) => {
      if (!snap.exists()) {
        setschedules(undefined);
        return;
      }

      const val = snap.val();
      setschedules(val);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {schedules !== "loading" &&
        (schedules ? (
          <SavedList
            savedSchedules={schedules}
            allClasses={allClasses}
            stateType={{
              type: "setStateAction",
              dispatch: setCurrentClasses,
            }}
          />
        ) : (
          <Link href="/editor">
            <Button variant="special">Go to editor</Button>
          </Link>
        ))}
    </div>
  );
}

export default RightNavbar;
