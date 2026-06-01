import { useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Checkbox } from "src/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "src/components/ui/field";
import { Input } from "src/components/ui/input";
import { useSessionStorage } from "src/hooks";
import { onWorkerMessage, postWorkerMessage } from "src/lib/store/worker";
import type { Code } from "src/types/autobuild";
import type { SavedSection } from "src/types/schedule";
import { Button, PageLoading } from "@/components";
import CodesForm from "./CodesForm";
import Results from "./Results";

type BulidingState =
  | {
      type: "form";
    }
  | {
      type: "building";
    }
  | {
      type: "completed";
      schedules: SavedSection[][];
    };

function Autobuild() {
  const [buildingState, setBuildingState] = useState<BulidingState>({
    type: "form",
  });

  const [codes, setCodes] = useSessionStorage<Code[]>([], "codes");
  const [useCurrent, setUseCurrent] = useSessionStorage(false, "useCurrent");
  const [dayOff, setDayOff] = useSessionStorage<string[]>([], "dayOff");
  const [time, setTime] = useSessionStorage<[string, string]>(
    ["00:00", "23:59"],
    "time",
  );

  const sections = useSearch({
    from: "/editor/autobuild",
    select: (s) => s.sections,
  });

  const makeGeneration = useCallback(
    () =>
      postWorkerMessage({
        type: "generate",
        codes,
        currentSections: sections,
        useCurrent,
        dayOff,
        time,
      }),
    [codes, sections, useCurrent, dayOff, time],
  );

  const onReturn = useCallback(() => setBuildingState({ type: "form" }), []);

  useEffect(() => {
    const unsub = onWorkerMessage("generate", (e) => {
      setBuildingState({ type: "completed", schedules: e.data.schedules });
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <div className="relative box-border flex h-full w-full flex-col items-center gap-2 overflow-x-hidden overflow-y-auto p-2">
      {buildingState.type === "form" && (
        <>
          <h1 className="font-heading text-center text-xl">Auto Builder</h1>
          <Field orientation="horizontal" className="w-full">
            <Checkbox
              id="use-current"
              onCheckedChange={() => setUseCurrent((prev) => !prev)}
              checked={useCurrent}
            />
            <FieldLabel htmlFor="use-current">
              Use the current schedule as baseline
            </FieldLabel>
          </Field>

          <FieldGroup className="flex w-full flex-row gap-3">
            <p className="text-sm">Days off:</p>
            {["M", "T", "W", "R", "F"].map((day) => (
              <FieldLabel htmlFor={day} key={day} className="flex w-fit gap-2">
                <Checkbox
                  id={day}
                  name={day}
                  onCheckedChange={() => {
                    if (dayOff.includes(day)) {
                      setDayOff(dayOff.filter((d) => d !== day));
                    } else {
                      setDayOff([...dayOff, day]);
                    }
                  }}
                  checked={dayOff.includes(day)}
                />
                <p>{day}</p>
              </FieldLabel>
            ))}
          </FieldGroup>

          <div className="flex w-full flex-row flex-wrap items-center gap-1 text-sm **:outline-none">
            <p>Time range: </p>
            <Input
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
              id="from"
              className="w-fit"
              name="from"
            />

            <p>to</p>

            <Input
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
              className="w-fit"
              id="to"
              name="to"
            />
          </div>

          <div className="w-full flex-1 overflow-x-hidden overflow-y-auto">
            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-2">
              <CodesForm
                codes={codes}
                setCodes={setCodes}
                useCurrent={useCurrent}
              />
            </div>
          </div>
          <div className="bg-background relative bottom-0 z-5 flex items-center justify-center">
            <Button
              variant="special"
              className="w-fit"
              onClick={() => {
                setBuildingState({ type: "building" });
                makeGeneration();
              }}
            >
              Generate
            </Button>
          </div>
        </>
      )}
      {buildingState.type === "building" && <PageLoading />}
      {buildingState.type === "completed" && (
        <Results
          generatedSchedules={buildingState.schedules}
          onReturn={onReturn}
        />
      )}
    </div>
  );
}

export default Autobuild;
