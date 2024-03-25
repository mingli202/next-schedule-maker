"use client";

import { AnimatePresence } from "framer-motion";
import ScheduleCard from "./ScheduleCard";
import { Class, Saved, StateType } from "@/types";
import { useState } from "react";

type Props = {
  savedSchedules: Record<string, Saved>;
  allClasses: Record<string, Class>;
  noEdit?: boolean;
  select?: boolean;
  stateType: StateType;
  customSelect?: (id: string, s: Saved) => void;
};

const SavedList = ({
  savedSchedules,
  allClasses,
  noEdit,
  select,
  stateType,
  customSelect,
}: Props) => {
  const [highlight, setHighlight] = useState<string>();

  return (
    <div className="basis-full overflow-y-auto overflow-x-hidden max-md:text-sm">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(7rem,1fr))] gap-1 md:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
        <AnimatePresence>
          {Object.entries(savedSchedules).map(([id, s]) => {
            return (
              <ScheduleCard
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
};

export default SavedList;
