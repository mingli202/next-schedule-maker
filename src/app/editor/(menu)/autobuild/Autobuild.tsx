"use client";

import { Class, Code, SharedCurrentClasses } from "@/types";
import { useState } from "react";
import Form from "./Form";
import { Button } from "@/ui";
import Loader from "./Loader";
import Results from "./Results";
import useSessionStorage from "./useSessionStorage";

type Props = {
  allClasses: Record<string, Class>;
  colors: string[];
};

function Autobuild({ allClasses, colors }: Props) {
  const [isBuilding, setIsBuilding] = useState<
    "form" | "building" | "complete"
  >("form");

  const [codes, setCodes] = useSessionStorage<Code[]>([], "codes");
  const [useCurrent, setUseCurrent] = useSessionStorage(false, "useCurrent");
  const [dayOff, setDayOff] = useSessionStorage<string[]>([], "dayOff");
  const [time, setTime] = useSessionStorage<[string, string]>(
    ["00:00", "23:59"],
    "time",
  );

  const [generatedSchedules, setGeneratedSchedules] = useState<
    SharedCurrentClasses[][]
  >([]);

  return (
    <div className="relative box-border flex h-full w-full flex-col items-center gap-2 overflow-y-auto overflow-x-hidden p-2">
      {isBuilding === "form" && (
        <>
          <div className="flex w-full flex-col gap-2">
            <div>
              <h1 className="text-center font-heading text-xl">Auto Builder</h1>
            </div>
            <label htmlFor="useCurrent" className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useCurrent"
                name="useCurrent"
                onChange={() => setUseCurrent(!useCurrent)}
                checked={useCurrent}
              />
              <p>Use the current schedule as baseline</p>
            </label>

            <div className="flex gap-3">
              <p>Days off:</p>
              {["M", "T", "W", "R", "F"].map((day) => (
                <label
                  htmlFor={day}
                  className="flex items-center gap-2"
                  key={day}
                >
                  <input
                    type="checkbox"
                    id={day}
                    name={day}
                    onChange={() => {
                      if (dayOff.includes(day)) {
                        setDayOff(dayOff.filter((d) => d !== day));
                      } else {
                        setDayOff([...dayOff, day]);
                      }
                    }}
                    defaultChecked={dayOff.includes(day)}
                  />
                  <p>{day}</p>
                </label>
              ))}
            </div>

            <div className="flex flex-wrap gap-1 [&_*]:outline-none">
              <p>Time range: </p>
              <label className="flex gap-1" htmlFor="from">
                <input
                  type="time"
                  defaultValue={time[0]}
                  min="08:00"
                  max="18:00"
                  step={`${60 * 30}`}
                  placeholder="18:00"
                  autoComplete="off"
                  onChange={(e) => {
                    setTime([e.target.value, time[1]]);
                  }}
                  className="rounded-md text-black"
                  id="from"
                  name="from"
                />
              </label>

              <p>to</p>

              <label className="flex gap-1" htmlFor="to">
                <input
                  type="time"
                  defaultValue={time[1]}
                  min="08:00"
                  max="18:00"
                  step={`${60 * 30}`}
                  placeholder="18:00"
                  autoComplete="off"
                  onChange={(e) => {
                    setTime([time[0], e.target.value]);
                  }}
                  className="rounded-md text-black"
                  id="to"
                  name="to"
                />
              </label>
            </div>

            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-2">
              <Form
                allClasses={allClasses}
                codes={codes}
                setCodes={setCodes}
                useCurrent={useCurrent}
              />
            </div>
          </div>
          <div className="relative bottom-0 z-[5] flex items-center justify-center bg-bgPrimary">
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
          useCurrent={useCurrent}
          dayOff={dayOff}
          time={time}
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
}

export default Autobuild;
