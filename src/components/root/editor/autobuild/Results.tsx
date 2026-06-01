import { useEffect } from "react";
import type { SavedSection } from "src/types/schedule";
import Schedule from "./Schedule";

type Props = {
  setIsBuilding: React.Dispatch<
    React.SetStateAction<"form" | "building" | "complete">
  >;
  generatedSchedules: SavedSection[][];
};

function Results({ setIsBuilding, generatedSchedules }: Props) {
  useEffect(() => {
    setIsBuilding("complete");
  }, [setIsBuilding]);

  return (
    <div className="relative flex h-[80dvh] w-full flex-col gap-2 overflow-x-hidden overflow-y-auto rounded-md md:h-full">
      {generatedSchedules.length === 0 ? (
        <p>No schedule can be made.</p>
      ) : (
        <>
          <p className="shrink-0">
            Generated {generatedSchedules.length} schedules
          </p>
          {generatedSchedules.map((schedule, i) => (
            <Schedule key={i.toString()} schedule={schedule} index={i} />
          ))}
        </>
      )}
    </div>
  );
}

export default Results;
