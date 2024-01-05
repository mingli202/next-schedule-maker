"use client";

import { Class, SharedCurrentClasses } from "@/types";
import { useState } from "react";
import Form from "./Form";
import { Button } from "@/ui";
import Loader from "./Loader";
import Results from "./Results";

type Props = {
  allClasses: Record<string, Class>;
  colors: string[];
};

const Autobuild = ({ allClasses, colors }: Props) => {
  const [isBuilding, setIsBuilding] = useState<
    "form" | "building" | "complete"
  >("form");

  const [codes, setCodes] = useState<string[]>([]);

  const [generatedSchedules, setGeneratedSchedules] = useState<
    SharedCurrentClasses[][]
  >([]);

  return (
    <div className="box-border flex w-full flex-col items-center gap-2 overflow-y-auto overflow-x-hidden p-2">
      {isBuilding === "form" && (
        <>
          <div>
            <h1 className="text-center font-heading text-xl">Auto Builder</h1>
            <p className="text-center">
              Input additional course codes and generate all possible schedules
              based on the current schedule displayed.
            </p>
            <p className="text-center">
              This is done by brute force. It is recommended to already have at
              least 2 courses in the current schedule, otherwise it will take an
              absurd amount of time to compute all possibilities.
            </p>
          </div>
          <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-2">
            {codes.map((code) => (
              <p
                key={code}
                className="flex cursor-pointer items-center rounded-md bg-bgSecondary p-2 transition hover:bg-secondary"
                onClick={() => setCodes(codes.filter((c) => c !== code))}
                title="remove"
              >
                {code}
              </p>
            ))}
            <Form
              allClasses={allClasses}
              codes={codes}
              setCodes={setCodes}
              setIsBuilding={setIsBuilding}
            />
          </div>
          <div className="fixed bottom-0 z-10 flex items-center justify-center bg-bgPrimary p-2">
            <Button
              variant="special"
              className="w-fit"
              onClick={() => setIsBuilding("building")}
            >
              Generate
            </Button>
          </div>
        </>
      )}
      {isBuilding === "building" && (
        <Loader
          setGeneratedSchedules={setGeneratedSchedules}
          colors={colors}
          codes={codes}
          setIsBuilding={setIsBuilding}
        />
      )}
      {isBuilding === "complete" && (
        <Results
          setIsBuilding={setIsBuilding}
          generatedSchedules={generatedSchedules}
          allClasses={allClasses}
        />
      )}
    </div>
  );
};

export default Autobuild;
