"use client";

import { AnimatePresence } from "framer-motion";
import ScheduleCard from "./ScheduleCard";
import { Class, Saved } from "@/types";

type Props = {
  savedSchedules: Saved[];
  allClasses?: Record<string, Class>;
  colors: string[];
  uid: string | null;
  userSaved?: boolean;
  userPreview?: boolean;
};

const SavedList = ({
  savedSchedules,
  allClasses,
  colors,
  uid,
  userSaved,
  userPreview,
}: Props) => {
  return (
    <div className="basis-full overflow-y-auto overflow-x-hidden">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-1">
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
                userSaved={userSaved}
                userPreview={userPreview}
              />
            );
          })}
          <div className="col-span-full h-0 bg-transparent" />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SavedList;
