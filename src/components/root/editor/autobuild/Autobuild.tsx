import { useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Checkbox } from "src/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "src/components/ui/field";
import { Input } from "src/components/ui/input";
import { useSessionStorage } from "src/hooks";
import { SessionStorageKey } from "src/lib/storageKeys";
import {
  clearGeneratedSchedulesCache,
  deleteGeneratedSchedulesCache,
  getGeneratedSchedulesCache,
  setGeneratedSchedulesCache,
} from "src/lib/store/db";
import { onWorkerMessage, postWorkerMessage } from "src/lib/store/worker";
import { generateId } from "src/lib/utils";
import type { Code } from "src/types/autobuild";
import type { SavedSection } from "src/types/schedule";
import { Button, PageLoading } from "@/components";
import CodesForm from "./CodesForm";
import Results from "./Results";

const GENERATED_SCHEDULES_CACHE_KEY = "latest-autobuild";

function createGeneratedSchedulesCacheKey() {
  const id = generateId();

  return `${GENERATED_SCHEDULES_CACHE_KEY}-${id}`;
}

type BuildingState =
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

  const [buildingState, setBuildingState] = useState<BuildingState>({
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
    SessionStorageKey.AUTOBUILDER_OPTIONS,
  );

  const [_cacheMetadata, setCacheMetadata] = useSessionStorage<{
    schedulesCacheKey: string | null;
    lastScrolledIndex: number;
  }>(
    {
      schedulesCacheKey: null,
      lastScrolledIndex: 0,
    },
    SessionStorageKey.AUTOBUILDER_GENERATION_CACHE_METADATA,
    (c) => {
      initialScroll.current = c.lastScrolledIndex;
      schedulesCacheKeyRef.current = c.schedulesCacheKey ?? null;

      if (c.schedulesCacheKey == null) {
        void clearGeneratedSchedulesCache();
        setBuildingState({ type: "form" });
        return;
      }

      void getGeneratedSchedulesCache(c.schedulesCacheKey).then(
        (cachedSchedules) => {
          if (cachedSchedules !== null) {
            setGeneratedSchedules(cachedSchedules.schedules);
          }

          setBuildingState({ type: "form" });
        },
      );
    },
  );

  const [generatedSchedules, setGeneratedSchedules] = useState<
    SavedSection[][] | null
  >(null);

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

    schedulesCacheKeyRef.current = null;
    initialScroll.current = 0;

    setGeneratedSchedules(null);
    setCacheMetadata({
      lastScrolledIndex: 0,
      schedulesCacheKey: null,
    });
    setBuildingState({ type: "form" });

    if (schedulesCacheKey != null) {
      void deleteGeneratedSchedulesCache(schedulesCacheKey);
    }
  }, [setCacheMetadata]);

  const onScroll = useCallback(
    (start: number) => {
      setCacheMetadata((c) => ({
        schedulesCacheKey: c.schedulesCacheKey,
        lastScrolledIndex: start,
      }));
    },
    [setCacheMetadata],
  );

  const setCodes = useCallback(
    (fn: (code: Code[]) => Code[]) =>
      setOptions((c) => ({ ...c, codes: fn(c.codes) })),
    [setOptions],
  );

  useEffect(() => {
    const abortController = new AbortController();

    const unsub = onWorkerMessage("generate", (e) => {
      const previousSchedulesCacheKey = schedulesCacheKeyRef.current;
      const nextSchedulesCacheKey = createGeneratedSchedulesCacheKey();

      schedulesCacheKeyRef.current = nextSchedulesCacheKey;
      setGeneratedSchedules(e.schedules);
      setCacheMetadata((c) => ({
        lastScrolledIndex: c.lastScrolledIndex,
        schedulesCacheKey: nextSchedulesCacheKey,
      }));

      if (previousSchedulesCacheKey !== null) {
        void deleteGeneratedSchedulesCache(
          previousSchedulesCacheKey,
          abortController.signal,
        );
      }

      void setGeneratedSchedulesCache(
        nextSchedulesCacheKey,
        e.schedules,
        abortController.signal,
      ).then((success) => {
        if (
          !success &&
          schedulesCacheKeyRef.current === nextSchedulesCacheKey
        ) {
          schedulesCacheKeyRef.current = null;
          setCacheMetadata((c) => ({
            lastScrolledIndex: c.lastScrolledIndex,
            schedulesCacheKey: null,
          }));
        }
      });
    });

    return () => {
      abortController.abort();
      unsub();
    };
  }, [setCacheMetadata]);

  return (
    <div className="relative box-border flex h-full w-full flex-col items-center gap-2 overflow-x-hidden overflow-y-auto p-2">
      {generatedSchedules === null ? (
        <>
          {buildingState.type === "form" && (
            <>
              <Field orientation="horizontal" className="w-full">
                <Checkbox
                  id="use-current"
                  onCheckedChange={() =>
                    setOptions((o) => ({ ...o, useCurrent: !o.useCurrent }))
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
                          setOptions((o) => ({
                            ...o,
                            dayOff: o.dayOff.filter((d) => d !== day),
                          }));
                        } else {
                          setOptions((o) => ({
                            ...o,
                            dayOff: [...o.dayOff, day],
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
                    setOptions((o) => ({
                      ...o,
                      time: [e.target.value, o.time[1]],
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
                    setOptions((o) => ({
                      ...o,
                      time: [o.time[0], e.target.value],
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
                    setCodes={setCodes}
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
          {/* at first show a blank screen to avoid flickering since loading is fast */}
          {buildingState.type === "initial-load" && null}
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
