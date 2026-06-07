import {
  convexQuery,
  useConvexAuth,
  useConvexMutation,
} from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useCallback } from "react";
import { useIndexedDb } from "src/hooks/useIndexedDb";
import { IndexedDbKey, LocalStorageKey } from "src/lib/storageKeys";
import type {
  SavedSchedule,
  SaveScheduleInput,
} from "src/types/savedSchedule";

const SAVED_SCHEDULES_KEY = LocalStorageKey.SAVED_SCHEDULES;

/**
 * Loads saved schedules from Convex when authenticated, otherwise uses IndexedDB.
 * @returns the schedules, a setter and deleter
 * */
export function useSavedSchedule() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const {
    value: localSavedSchedules,
    update: updateLocalSavedSchedules,
    error: localSavedSchedulesError,
  } = useIndexedDb(IndexedDbKey.SAVED_SCHEDULES_STORE, SAVED_SCHEDULES_KEY);

  const schedulesQuery = useQuery(
    convexQuery(
      api.schedules.queries.getSchedules,
      isAuthenticated ? {} : "skip",
    ),
  );

  const {
    mutate: createSchedule,
    isPending: isCreatingSchedule,
    error: createScheduleError,
  } = useMutation({
    mutationFn: useConvexMutation(api.schedules.mutations.createSchedule),
  });

  const {
    mutate: removeSchedule,
    isPending: isDeletingSchedule,
    error: deleteScheduleError,
  } = useMutation({
    mutationFn: useConvexMutation(api.schedules.mutations.deleteSchedule),
  });

  const setSavedSchedule = useCallback(
    (schedule: SaveScheduleInput) => {
      const name = schedule.name ?? "Untitled";
      const source = schedule.source ?? "default";

      if (isLoading) {
        return;
      }

      if (isAuthenticated) {
        createSchedule({
          name,
          source,
          sections: schedule.sections,
        });
        return;
      }

      updateLocalSavedSchedules((prev) => {
        const savedSchedules = prev?.savedSchedules ?? [];

        return {
          key: SAVED_SCHEDULES_KEY,
          updatedAt: Date.now(),
          savedSchedules: [...savedSchedules, schedule.sections],
        };
      });
    },
    [createSchedule, isAuthenticated, isLoading, updateLocalSavedSchedules],
  );

  const deleteSavedSchedule = useCallback(
    (scheduleId: string) => {
      if (isLoading) {
        return;
      }

      if (isAuthenticated) {
        removeSchedule({
          scheduleId: scheduleId as Id<"schedules">,
        });
        return;
      }

      updateLocalSavedSchedules((prev) => {
        const savedSchedules = prev?.savedSchedules ?? [];

        return {
          key: SAVED_SCHEDULES_KEY,
          updatedAt: Date.now(),
          savedSchedules: savedSchedules.filter(
            (_schedule, index) => String(index) !== scheduleId,
          ),
        };
      });
    },
    [isAuthenticated, isLoading, removeSchedule, updateLocalSavedSchedules],
  );

  const localSchedules: Array<SavedSchedule> = (
    localSavedSchedules?.savedSchedules ?? []
  ).map((sections, index) => ({
    id: String(index),
    name: `Schedule ${index + 1}`,
    source: "indexed-db",
    sections,
  }));

  const schedules = isAuthenticated
    ? (schedulesQuery.data ?? []).map((schedule) => ({
        id: schedule._id,
        name: schedule.name,
        source: schedule.source,
        sections: schedule.sections,
      }))
    : localSchedules;

  return {
    schedules,
    setSavedSchedule,
    deleteSavedSchedule,
    isLoading:
      isLoading ||
      (isAuthenticated && schedulesQuery.isPending) ||
      isCreatingSchedule ||
      isDeletingSchedule,
    error:
      schedulesQuery.error ??
      createScheduleError ??
      deleteScheduleError ??
      localSavedSchedulesError,
  } as const;
}

export function useCreateSchedule() {
  const { setSavedSchedule, deleteSavedSchedule, ...rest } = useSavedSchedule();

  const update = useCallback(
    (schedule: SaveScheduleInput) => {
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
