"use client";

import { Class, SharedCurrentClasses } from "@/types";
import { useEffect } from "react";
import Schedule from "./Schedule";

type Props = {
  setIsBuilding: React.Dispatch<
    React.SetStateAction<"form" | "building" | "complete">
  >;
  allClasses: Record<string, Class>;
  generatedSchedules: SharedCurrentClasses[][];
};

const Results = ({ setIsBuilding, generatedSchedules, allClasses }: Props) => {
  useEffect(() => {
    setIsBuilding("complete");
  }, [setIsBuilding]);

  return (
    <>
      {generatedSchedules.length === 0 ? (
        <p>No schedule can be made.</p>
      ) : (
        generatedSchedules.map((schedule, i) => (
          <Schedule key={i} schedule={schedule} allClasses={allClasses} />
        ))
      )}
    </>
  );
};

export default Results;
