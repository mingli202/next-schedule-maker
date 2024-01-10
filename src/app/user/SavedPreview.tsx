"use client";

import { cn } from "@/lib";
import { HTMLAttributes, useContext } from "react";
import { SchedulesContext } from "./LoginStateObserver";

type Props = {
  colors: string[];
} & HTMLAttributes<HTMLDivElement>;

const SavedPreview = ({ className, ...props }: Props) => {
  const schedules = useContext(SchedulesContext);

  return (
    <div className={cn(className)} {...props}>
      <h2>My Schedules</h2>
      {schedules ? (
        schedules.map((sh, i) => <div key={i}>Some schedule</div>)
      ) : (
        <div>Link to editor</div>
      )}
    </div>
  );
};

export default SavedPreview;
