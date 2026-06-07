import type { SavedSchedule } from "convex/types";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import ScheduleCard from "./ScheduleCard";

type Props = {
  savedSchedules: SavedSchedule[];
  onScheduleDelete: (scheduleId: string) => void;
  onSheduleNameChange: (schduleId: string, newName: string) => void;
  noEdit?: boolean;
};

export default function SavedList({
  savedSchedules,
  onScheduleDelete,
  onSheduleNameChange,
  noEdit,
}: Props) {
  const [selectedId, setSelectedId] = useState<string>();

  return (
    <div className="basis-full overflow-x-hidden overflow-y-auto max-md:text-sm">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(7rem,1fr))] gap-1 md:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
        <AnimatePresence>
          {savedSchedules.map((s) => {
            return (
              <ScheduleCard
                schedule={s}
                key={s.id}
                selectedId={selectedId}
                onScheduleSelect={setSelectedId}
                onScheduleDelete={onScheduleDelete}
                onSheduleNameChange={onSheduleNameChange}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                disableEdit={noEdit}
              />
            );
          })}
          <div className="col-span-full h-0 bg-transparent" />
        </AnimatePresence>
      </div>
    </div>
  );
}
