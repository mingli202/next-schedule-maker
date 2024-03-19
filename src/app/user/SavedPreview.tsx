"use client";

import { cn } from "@/lib";
import { HTMLAttributes, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/ui";

import { Class, Saved } from "@/types";
import { getAuth } from "firebase/auth";
import { app, db } from "@/backend";
import { onValue, ref } from "firebase/database";
import SavedList from "../components/SavedList";
import { SetScheduleContext } from "./Context";
import { useRouter } from "next/navigation";

type Props = {
  allClasses: Record<string, Class>;
} & HTMLAttributes<HTMLDivElement>;

const SavedPreview = ({ className, allClasses, ...props }: Props) => {
  const [schedules, setSchedules] = useState<
    Record<string, Saved> | null | "loading"
  >("loading");

  const setCurrentClasses = useContext(SetScheduleContext);

  const router = useRouter();

  useEffect(() => {
    const user = getAuth(app).currentUser;
    if (!user) return;

    const unsub = onValue(ref(db, `/users/${user.uid}/schedules`), (snap) => {
      const val = snap.val();
      setSchedules(val);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <div
      className={cn("flex flex-col gap-2 overflow-hidden", className)}
      {...props}
    >
      <Link href="/user/saved" className="w-full shrink-0">
        <h2 className="text-xl font-bold md:text-2xl">My Schedules</h2>
      </Link>

      {schedules !== "loading" ? (
        schedules ? (
          <SavedList
            savedSchedules={schedules ?? {}}
            allClasses={allClasses}
            stateType={{
              type: "setStateAction",
              dispatch: setCurrentClasses,
            }}
            customSelect={() => {
              router.push("/user/saved");
            }}
          />
        ) : (
          <div>
            <p>
              You don{"'"}t seem to have any schedule saved. Click to start
              building!
            </p>
            <Link href="/editor">
              <Button variant="special">Go to editor</Button>
            </Link>
          </div>
        )
      ) : null}
    </div>
  );
};

export default SavedPreview;
