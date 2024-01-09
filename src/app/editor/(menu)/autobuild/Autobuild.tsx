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
    <div className="relative box-border flex h-full w-full flex-col items-center gap-2 overflow-hidden p-2">
      {isBuilding === "form" && (
        <>
          <div className="flex h-full flex-col gap-2">
            <div>
              <h1 className="text-center font-heading text-xl">Auto Builder</h1>
              <p className="text-center">
                Input additional course codes and generate all possible
                schedules based on the current schedule displayed. Note that the
                codes below must be extra courses not present in the current
                schedule.
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
          </div>
          <div className="relative bottom-0 z-10 flex items-center justify-center bg-bgPrimary">
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
        <>
          <div className="flex h-full w-full flex-col gap-2 overflow-y-auto overflow-x-hidden rounded-md">
            <Results
              setIsBuilding={setIsBuilding}
              generatedSchedules={generatedSchedules}
              allClasses={allClasses}
            />
          </div>
          <div className="z-10 flex w-full items-center justify-center bg-bgPrimary">
            <Button
              variant="special"
              className="w-fit"
              onClick={() => setIsBuilding("form")}
            >
              Return
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Autobuild;
