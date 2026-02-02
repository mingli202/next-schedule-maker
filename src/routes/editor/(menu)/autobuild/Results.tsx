"use client";

import { Class, SharedCurrentClasses } from "@/types";
import { useEffect, useState } from "react";
import Schedule from "./Schedule";

type Props = {
  setIsBuilding: React.Dispatch<
    React.SetStateAction<"form" | "building" | "complete">
  >;
  allClasses: Record<string, Class>;
  generatedSchedules: SharedCurrentClasses[][];
};

function Results({ setIsBuilding, generatedSchedules, allClasses }: Props) {
  const [over, setOver] = useState(0);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    setIsBuilding("complete");
  }, [setIsBuilding]);

  return (
    <div
      className="relative flex h-[80dvh] w-full flex-col gap-2 overflow-y-auto overflow-x-hidden rounded-md md:h-full"
      onScroll={(e) => setScroll(e.currentTarget.scrollTop)}
    >
      {generatedSchedules.length === 0 ? (
        <p>No schedule can be made.</p>
      ) : (
        <>
          <p>Generated {generatedSchedules.length} schedules</p>
          {generatedSchedules.map(
            (schedule, i) =>
              i <= over + 10 && (
                <Schedule
                  key={i}
                  schedule={schedule}
                  allClasses={allClasses}
                  scroll={scroll}
                  setOver={setOver}
                  index={i}
                />
              ),
          )}
        </>
      )}
    </div>
  );
}

export default Results;
