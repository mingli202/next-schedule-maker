"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import ScheduleCard from "./ScheduleCard";

type Props = {
  savedSchedules: Record<string, Saved>;
  setSavedSchedules?: React.Dispatch<
    React.SetStateAction<Record<string, Saved> | undefined>
  >;
  allClasses: Record<string, Class>;
  noEdit?: boolean;
  select?: boolean;
  stateType: StateType;
  customSelect?: (id: string, s: Saved) => void;
};

export default function SavedList({
  savedSchedules,
  setSavedSchedules,
  allClasses,
  noEdit,
  select,
  stateType,
  customSelect,
}: Props) {
  const [highlight, setHighlight] = useState<string>();

  return (
    <div className="basis-full overflow-x-hidden overflow-y-auto max-md:text-sm">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(7rem,1fr))] gap-1 md:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
        <AnimatePresence>
          {Object.entries(savedSchedules)
            .filter(([, s]) => s.semester === "winter2026")
            .map(([id, s]) => {
              return (
                <ScheduleCard
                  setSavedSchedules={setSavedSchedules}
                  highlight={highlight}
                  handleHighlight={() => {
                    if (!select) return;
                    setHighlight(id);
                  }}
                  schedule={s}
                  key={id}
                  schId={id}
                  allClasses={allClasses}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  noEdit={noEdit}
                  stateType={stateType}
                  customSelect={customSelect}
                />
              );
            })}
          <div className="col-span-full h-0 bg-transparent" />
        </AnimatePresence>
      </div>
    </div>
  );
}
