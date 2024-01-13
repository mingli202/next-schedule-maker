"use client";

import { cn } from "@/lib";
import { HTMLAttributes, useContext } from "react";
import Link from "next/link";
import { Button } from "@/ui";
import SavedList from "../editor/(menu)/saved/SavedList";
import { getAuth } from "firebase/auth";
import { app } from "@/backend";

import { Class } from "@/types";
import { SchedulesContext } from "./Context";

type Props = {
  colors: string[];
  allClasses: Record<string, Class>;
} & HTMLAttributes<HTMLDivElement>;

const SavedPreview = ({ className, allClasses, colors, ...props }: Props) => {
  const schedules = useContext(SchedulesContext);

  return (
    <div
      className={cn("flex flex-col gap-2 overflow-hidden", className)}
      {...props}
    >
      <Link href="/user/saved" className="w-full shrink-0">
        <h2 className="text-2xl font-bold">My Schedules</h2>
      </Link>

      {schedules ? (
        <SavedList
          savedSchedules={schedules}
          colors={colors}
          uid={getAuth(app).currentUser?.uid ?? null}
          userPreview
          userSaved
          allClasses={allClasses}
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
      )}
    </div>
  );
};

export default SavedPreview;
