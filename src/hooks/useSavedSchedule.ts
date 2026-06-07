import {
  convexQuery,
  useConvexAuth,
  useConvexMutation,
} from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useCallback, useEffect, useState } from "react";
import { IndexedDbKey, LocalStorageKey } from "src/lib/storageKeys";
import { indexedDbGet, indexedDbSet } from "src/lib/store/db";
import type { SavedSection } from "src/types/schedule";

const SAVED_SCHEDULES_KEY = LocalStorageKey.SAVED_SCHEDULES;

export type SavedSchedule = {
  id: string;
  name: string;
  source: string;
  sections: Array<SavedSection>;
};

export type SaveScheduleInput = {
  name?: string;
  source?: string;
  sections: Array<SavedSection>;
};

/**
 * Loads saved schedules from Convex when authenticated, otherwise uses IndexedDB.
 * @returns the schedules, a setter and deleter
 * */
export function useSavedSchedule() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [localSchedules, setLocalSchedules] = useState<Array<SavedSchedule>>([]);

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

  useEffect(() => {
    if (isLoading || isAuthenticated) {
      return;
    }

    let ignore = false;

    indexedDbGet(IndexedDbKey.SAVED_SCHEDULES_STORE, SAVED_SCHEDULES_KEY).then(
      (record) => {
        if (ignore) {
          return;
        }

        setLocalSchedules(
          (record?.savedSchedules ?? []).map((sections, index) => ({
            id: String(index),
            name: `Schedule ${index + 1}`,
            source: "indexed-db",
            sections,
          })),
        );
      },
    );

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, isLoading]);

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

      setLocalSchedules((prev) => {
        const next = [
          ...prev,
          {
            id: String(prev.length),
            name,
            source,
            sections: schedule.sections,
          },
        ];

        indexedDbSet(IndexedDbKey.SAVED_SCHEDULES_STORE, SAVED_SCHEDULES_KEY, {
          savedSchedules: next.map(({ sections }) => sections),
        });

        return next;
      });
    },
    [createSchedule, isAuthenticated, isLoading],
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

      setLocalSchedules((prev) => {
        const next = prev
          .filter((schedule) => schedule.id !== scheduleId)
          .map((schedule, index) => ({
            ...schedule,
            id: String(index),
          }));

        indexedDbSet(IndexedDbKey.SAVED_SCHEDULES_STORE, SAVED_SCHEDULES_KEY, {
          savedSchedules: next.map(({ sections }) => sections),
        });

        return next;
      });
    },
    [isAuthenticated, isLoading, removeSchedule],
  );

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
    error: schedulesQuery.error ?? createScheduleError ?? deleteScheduleError,
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
