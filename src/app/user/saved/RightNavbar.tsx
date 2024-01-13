"use client";

import { cn } from "@/lib";
import { useContext } from "react";

import Link from "next/link";

import SavedList from "@/app/editor/(menu)/saved/SavedList";
import { getAuth } from "firebase/auth";
import { app } from "@/backend";
import { Class } from "@/types";
import { SchedulesContext } from "../Context";
import { Button } from "@/ui";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  colors: string[];
  allClasses: Record<string, Class>;
};

const RightNavbar = ({ className, colors, allClasses, ...props }: Props) => {
  const currentSchedules = useContext(SchedulesContext);

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {currentSchedules ? (
        <SavedList
          savedSchedules={currentSchedules}
          colors={colors}
          uid={getAuth(app).currentUser?.uid ?? null}
          userSaved
          allClasses={allClasses}
        />
      ) : (
        <Link href="/editor">
          <Button variant="special">Go to editor</Button>
        </Link>
      )}
    </div>
  );
};

export default RightNavbar;
