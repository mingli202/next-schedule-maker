import { useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Checkbox } from "src/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "src/components/ui/field";
import { Input } from "src/components/ui/input";
import { useSessionStorage } from "src/hooks";
import {
  deleteGeneratedSchedulesCache,
  getGeneratedSchedulesCache,
  setGeneratedSchedulesCache,
} from "src/lib/store/db";
import { onWorkerMessage, postWorkerMessage } from "src/lib/store/worker";
import type { Code } from "src/types/autobuild";
import type { SavedSection } from "src/types/schedule";
import { Button, PageLoading } from "@/components";
import CodesForm from "./CodesForm";
import Results from "./Results";

const GENERATED_SCHEDULES_CACHE_KEY = "latest-autobuild";

function createGeneratedSchedulesCacheKey() {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${GENERATED_SCHEDULES_CACHE_KEY}-${id}`;
}

type BulidingState =
  | {
      type: "initial-load";
    }
  | {
      type: "form";
    }
  | {
      type: "building";
    };

function Autobuild() {
  const initialScroll = useRef<number>(0);
  const schedulesCacheKeyRef = useRef<string | null>(null);

  const [buildingState, setBuildingState] = useState<BulidingState>({
    type: "initial-load",
  });

  const [options, setOptions] = useSessionStorage<{
    codes: Code[];
    useCurrent: boolean;
    dayOff: string[];
    time: [string, string];
  }>(
    {
      codes: [],
      useCurrent: false,
      dayOff: [],
      time: ["00:00", "23:59"],
    },
    "generation-cache",
  );

  const [cache, setCache] = useSessionStorage<{
    schedulesCacheKey: string | null;
    lastScrolledIndex: number;
  }>(
    {
      schedulesCacheKey: null,
      lastScrolledIndex: 0,
    },
    "cache",
    (c) => {
      initialScroll.current = c.lastScrolledIndex;
      schedulesCacheKeyRef.current = c.schedulesCacheKey ?? null;

      if (c.schedulesCacheKey == null) {
        setBuildingState({ type: "form" });
        return;
      }

      void getGeneratedSchedulesCache(c.schedulesCacheKey).then(
        (cachedSchedules) => {
          if (cachedSchedules !== null) {
            setGeneratedSchedules(cachedSchedules);
          }

          setBuildingState({ type: "form" });
        },
      );
    },
  );

  const [generatedSchedules, setGeneratedSchedules] = useState<
    SavedSection[][] | null
  >(null);

  useEffect(() => {
    if ("schedule" in cache) {
      setCache({
        schedulesCacheKey: cache.schedulesCacheKey ?? null,
        lastScrolledIndex: cache.lastScrolledIndex,
      });
    }
  }, [cache, setCache]);

  const sections = useSearch({
    from: "/editor/autobuild",
    select: (s) => s.sections,
  });

  const makeGeneration = useCallback(
    () =>
      postWorkerMessage({
        type: "generate",
        codes: options.codes,
        currentSections: sections,
        useCurrent: options.useCurrent,
        dayOff: options.dayOff,
        time: options.time,
      }),
    [options.codes, sections, options.useCurrent, options.dayOff, options.time],
  );

  const onReturn = useCallback(() => {
    const schedulesCacheKey = schedulesCacheKeyRef.current;

    setGeneratedSchedules(null);
    schedulesCacheKeyRef.current = null;
    setCache((c) => ({
      lastScrolledIndex: c.lastScrolledIndex,
      schedulesCacheKey: null,
    }));
    setBuildingState({ type: "form" });

    if (schedulesCacheKey != null) {
      void deleteGeneratedSchedulesCache(schedulesCacheKey);
    }
  }, [setCache]);

  const onScroll = useCallback(
    (start: number) => {
      setCache((c) => ({
        schedulesCacheKey: c.schedulesCacheKey,
        lastScrolledIndex: start,
      }));
    },
    [setCache],
  );

  useEffect(() => {
    const unsub = onWorkerMessage("generate", (e) => {
      const previousSchedulesCacheKey = schedulesCacheKeyRef.current;
      const nextSchedulesCacheKey = createGeneratedSchedulesCacheKey();

      schedulesCacheKeyRef.current = nextSchedulesCacheKey;
      setGeneratedSchedules(e.schedules);
      setCache((c) => ({
        lastScrolledIndex: c.lastScrolledIndex,
        schedulesCacheKey: nextSchedulesCacheKey,
      }));

      if (previousSchedulesCacheKey !== null) {
        void deleteGeneratedSchedulesCache(previousSchedulesCacheKey);
      }

      void setGeneratedSchedulesCache(nextSchedulesCacheKey, e.schedules).then(
        (success) => {
          if (
            !success &&
            schedulesCacheKeyRef.current === nextSchedulesCacheKey
          ) {
            schedulesCacheKeyRef.current = null;
            setCache((c) => ({
              lastScrolledIndex: c.lastScrolledIndex,
              schedulesCacheKey: null,
            }));
          }
        },
      );
    });

    return () => {
      unsub();
    };
  }, [setCache]);

  return (
    <div className="relative box-border flex h-full w-full flex-col items-center gap-2 overflow-x-hidden overflow-y-auto p-2">
      {generatedSchedules === null ? (
        <>
          {buildingState.type === "form" && (
            <>
              <h1 className="font-heading text-center text-xl">Auto Builder</h1>
              <Field orientation="horizontal" className="w-full">
                <Checkbox
                  id="use-current"
                  onCheckedChange={() =>
                    setOptions((c) => ({ ...c, useCurrent: !c.useCurrent }))
                  }
                  checked={options.useCurrent}
                />
                <FieldLabel htmlFor="use-current">
                  Use the current schedule as baseline
                </FieldLabel>
              </Field>

              <FieldGroup className="flex w-full flex-row gap-3">
                <p className="text-sm">Days off:</p>
                {["M", "T", "W", "R", "F"].map((day) => (
                  <FieldLabel
                    htmlFor={day}
                    key={day}
                    className="flex w-fit gap-2"
                  >
                    <Checkbox
                      id={day}
                      name={day}
                      onCheckedChange={() => {
                        if (options.dayOff.includes(day)) {
                          setOptions((c) => ({
                            ...c,
                            dayOff: c.dayOff.filter((d) => d !== day),
                          }));
                        } else {
                          setOptions((c) => ({
                            ...c,
                            dayOff: [...c.dayOff, day],
                          }));
                        }
                      }}
                      checked={options.dayOff.includes(day)}
                    />
                    <p>{day}</p>
                  </FieldLabel>
                ))}
              </FieldGroup>

              <div className="flex w-full flex-row flex-wrap items-center gap-1 text-sm **:outline-none">
                <p>Time range: </p>
                <Input
                  type="time"
                  defaultValue={options.time[0]}
                  min="08:00"
                  max="18:00"
                  step={`${60 * 30}`}
                  placeholder="18:00"
                  autoComplete="off"
                  onChange={(e) => {
                    setOptions((c) => ({
                      ...c,
                      time: [e.target.value, c.time[1]],
                    }));
                  }}
                  id="from"
                  className="w-fit"
                  name="from"
                />

                <p>to</p>

                <Input
                  type="time"
                  defaultValue={options.time[1]}
                  min="08:00"
                  max="18:00"
                  step={`${60 * 30}`}
                  placeholder="18:00"
                  autoComplete="off"
                  onChange={(e) => {
                    setOptions((c) => ({
                      ...c,
                      time: [c.time[0], e.target.value],
                    }));
                  }}
                  className="w-fit"
                  id="to"
                  name="to"
                />
              </div>

              <div className="w-full flex-1 overflow-x-hidden overflow-y-auto">
                <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-2">
                  <CodesForm
                    codes={options.codes}
                    setCodes={(fn) =>
                      setOptions((c) => ({ ...c, codes: fn(c.codes) }))
                    }
                    useCurrent={options.useCurrent}
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
          {buildingState.type === "initial-load" && <PageLoading />}
          {buildingState.type === "building" && <PageLoading />}
        </>
      ) : (
        <Results
          generatedSchedules={generatedSchedules}
          onReturn={onReturn}
          onScroll={onScroll}
          initialScroll={initialScroll.current}
        />
      )}
    </div>
  );
}

export default Autobuild;
