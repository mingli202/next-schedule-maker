import { useConvexAuth } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import type { SavedSchedule, SavedScheduleInput } from "convex/types";
import { useCallback } from "react";
import { useIndexedDb } from "src/hooks/useIndexedDb";
import { IndexedDbKey } from "src/lib/storageKeys";
import { generateId } from "src/lib/utils";
import type { IndexedDbRecordWithoutKey } from "src/types/indexedDb";

const SAVED_SCHEDULES_KEY = IndexedDbKey.SAVED_SCHEDULES_STORE;

/**
 * Loads saved schedules from Convex when authenticated, otherwise uses IndexedDB.
 * @returns the schedules, a setter and deleter
 * */
export function useSavedSchedule() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const {
    value: localSavedSchedules,
    set: setLocalSavedSchedules,
    error: localSavedSchedulesError,
  } = useIndexedDb(IndexedDbKey.SAVED_SCHEDULES_STORE, SAVED_SCHEDULES_KEY);

  const schedulesQuery = useQuery(
    api.schedules.queries.getSchedules,
    isAuthenticated ? {} : "skip",
  );

  const createSchedule = useMutation(api.schedules.mutations.createSchedule);

  const updateSchedule = useMutation(api.schedules.mutations.updateSchedule);

  const removeSchedule = useMutation(api.schedules.mutations.deleteSchedule);

  const setSavedSchedule = useCallback(
    (schedule: SavedScheduleInput) => {
      const name = schedule.name ?? "Untitled";
      const source = schedule.source ?? "default";

      if (isLoading) {
        return;
      }

      if (isAuthenticated) {
        console.log("setting in convex");
        createSchedule({
          name,
          source,
          sections: schedule.sections,
        });
        return;
      }

      console.log("setting in indexedDb");
      const id = generateId();
      const now = Date.now();

      setLocalSavedSchedules((prev) => {
        const savedSchedules = prev?.savedSchedules ?? [];

        return {
          savedSchedules: [
            ...savedSchedules,
            {
              ...schedule,
              id,
              creationTime: now,
            },
          ],
        } satisfies IndexedDbRecordWithoutKey<"saved-schedules-store">;
      });
    },
    [createSchedule, isAuthenticated, isLoading, setLocalSavedSchedules],
  );

  const updateSavedScheduleName = useCallback(
    (scheduleId: string, name: string) => {
      if (isLoading) {
        return;
      }

      if (isAuthenticated) {
        console.log("updating in convex");
        updateSchedule({
          name: name,
          scheduleId: scheduleId as Id<"schedules">,
        });
        return;
      }

      console.log("updating in indexedDb");
      setLocalSavedSchedules((oldSchedules) => {
        if (!oldSchedules) {
          return null;
        }

        return {
          savedSchedules: oldSchedules.savedSchedules.map((s) =>
            s.id === scheduleId
              ? {
                  ...s,
                  name,
                }
              : s,
          ),
        } satisfies IndexedDbRecordWithoutKey<"saved-schedules-store">;
      });
    },
    [isLoading, isAuthenticated, updateSchedule, setLocalSavedSchedules],
  );

  const deleteSavedSchedule = useCallback(
    (scheduleId: string) => {
      if (isLoading) {
        return;
      }

      if (isAuthenticated) {
        console.log(`deleting ${scheduleId} in convex`);
        removeSchedule({
          scheduleId: scheduleId as Id<"schedules">,
        });
        return;
      }

      console.log(`deleting ${scheduleId} in indexedDb`);
      setLocalSavedSchedules((prev) => {
        const savedSchedules = prev?.savedSchedules ?? [];

        return {
          key: SAVED_SCHEDULES_KEY,
          updatedAt: Date.now(),
          savedSchedules: savedSchedules.filter((s) => s.id !== scheduleId),
        };
      });
    },
    [isAuthenticated, isLoading, removeSchedule, setLocalSavedSchedules],
  );

  const localSchedules: SavedSchedule[] =
    localSavedSchedules?.savedSchedules ?? [];

  const schedules = isAuthenticated ? (schedulesQuery ?? []) : localSchedules;

  const isInitialLoading =
    isLoading || (isAuthenticated && schedulesQuery === undefined);

  return {
    schedules,
    setSavedSchedule,
    deleteSavedSchedule,
    updateSavedScheduleName,
    isLoading: isInitialLoading,
    error: localSavedSchedulesError,
  } as const;
}

export function useCreateSchedule() {
  const { setSavedSchedule, deleteSavedSchedule, ...rest } = useSavedSchedule();

  const update = useCallback(
    (schedule: SavedScheduleInput) => {
      setSavedSchedule(schedule);
    },
    [setSavedSchedule],
  );

  const remove = useCallback(
    (scheduleId: string) => {
      deleteSavedSchedule(scheduleId);
    },
    [deleteSavedSchedule],
  );

  return {
    ...rest,
    update,
    remove,
  } as const;
}
