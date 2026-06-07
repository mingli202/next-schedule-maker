import { useConvexAuth } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import type { SavedSchedule, SavedScheduleInput } from "convex/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const [pendingSchedules, setPendingSchedules] = useState<SavedSchedule[]>([]);
  const [clientToServerIdMap, setClientToServerIdMap] = useState<
    Record<string, Id<"schedules">>
  >({});
  const pendingDeleteOnCreateRef = useRef(new Set<string>());

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

  const updateSchedule = useMutation(
    api.schedules.mutations.updateSchedule,
  ).withOptimisticUpdate((localStore, args) => {
    const schedules = localStore.getQuery(
      api.schedules.queries.getSchedules,
      {},
    );

    if (!schedules) {
      return;
    }

    localStore.setQuery(
      api.schedules.queries.getSchedules,
      {},
      schedules.map((schedule) =>
        schedule.id === args.scheduleId
          ? {
              ...schedule,
              ...(args.name !== undefined ? { name: args.name } : {}),
              ...(args.source !== undefined ? { source: args.source } : {}),
            }
          : schedule,
      ),
    );
  });

  const removeSchedule = useMutation(
    api.schedules.mutations.deleteSchedule,
  ).withOptimisticUpdate((localStore, args) => {
    const schedules = localStore.getQuery(
      api.schedules.queries.getSchedules,
      {},
    );

    if (!schedules) {
      return;
    }

    localStore.setQuery(
      api.schedules.queries.getSchedules,
      {},
      schedules.filter((schedule) => schedule.id !== args.scheduleId),
    );
  });

  const setSavedSchedule = useCallback(
    (schedule: SavedScheduleInput) => {
      const name = schedule.name ?? "Untitled";
      const source = schedule.source ?? "default";

      if (isLoading) {
        return;
      }

      if (isAuthenticated) {
        const optimisticId = generateId();

        setPendingSchedules((prev) => [
          ...prev,
          {
            id: optimisticId,
            creationTime: Date.now(),
            name,
            source,
            sections: schedule.sections,
          },
        ]);

        void createSchedule({
          name,
          source,
          sections: schedule.sections,
        })
          .then((createdScheduleId) => {
            if (!createdScheduleId) {
              setPendingSchedules((prev) =>
                prev.filter((s) => s.id !== optimisticId),
              );
              return;
            }

            if (pendingDeleteOnCreateRef.current.has(optimisticId)) {
              pendingDeleteOnCreateRef.current.delete(optimisticId);
              setPendingSchedules((prev) =>
                prev.filter((s) => s.id !== optimisticId),
              );
              void removeSchedule({
                scheduleId: createdScheduleId,
              });
              return;
            }

            setClientToServerIdMap((prev) => ({
              ...prev,
              [optimisticId]: createdScheduleId,
            }));
          })
          .catch(() => {
            setPendingSchedules((prev) =>
              prev.filter((s) => s.id !== optimisticId),
            );
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
    [
      createSchedule,
      isAuthenticated,
      isLoading,
      removeSchedule,
      setLocalSavedSchedules,
    ],
  );

  const updateSavedScheduleName = useCallback(
    (scheduleId: string, name: string) => {
      if (isLoading) {
        return;
      }

      if (isAuthenticated) {
        const pendingSchedule = pendingSchedules.find(
          (s) => s.id === scheduleId,
        );

        if (pendingSchedule && !clientToServerIdMap[scheduleId]) {
          setPendingSchedules((prev) =>
            prev.map((schedule) =>
              schedule.id === scheduleId ? { ...schedule, name } : schedule,
            ),
          );
          return;
        }

        const resolvedScheduleId =
          clientToServerIdMap[scheduleId] ?? (scheduleId as Id<"schedules">);

        updateSchedule({
          name: name,
          scheduleId: resolvedScheduleId,
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
    [
      isLoading,
      isAuthenticated,
      pendingSchedules,
      clientToServerIdMap,
      updateSchedule,
      setLocalSavedSchedules,
    ],
  );

  const deleteSavedSchedule = useCallback(
    (scheduleId: string) => {
      if (isLoading) {
        return;
      }

      if (isAuthenticated) {
        const pendingSchedule = pendingSchedules.find(
          (s) => s.id === scheduleId,
        );

        if (pendingSchedule && !clientToServerIdMap[scheduleId]) {
          pendingDeleteOnCreateRef.current.add(scheduleId);
          setPendingSchedules((prev) =>
            prev.filter((s) => s.id !== scheduleId),
          );
          return;
        }

        const resolvedScheduleId =
          clientToServerIdMap[scheduleId] ?? (scheduleId as Id<"schedules">);

        removeSchedule({
          scheduleId: resolvedScheduleId,
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
    [
      isAuthenticated,
      isLoading,
      pendingSchedules,
      clientToServerIdMap,
      removeSchedule,
      setLocalSavedSchedules,
    ],
  );

  const localSchedules: SavedSchedule[] =
    localSavedSchedules?.savedSchedules ?? [];

  useEffect(() => {
    if (!isAuthenticated || !schedulesQuery || pendingSchedules.length === 0) {
      return;
    }

    const serverIds = new Set(schedulesQuery.map((schedule) => schedule.id));

    setPendingSchedules((prev) =>
      prev.filter((schedule) => {
        const serverId = clientToServerIdMap[schedule.id];

        if (!serverId) {
          return true;
        }

        return !serverIds.has(serverId);
      }),
    );
  }, [
    isAuthenticated,
    schedulesQuery,
    pendingSchedules.length,
    clientToServerIdMap,
  ]);

  const schedules = useMemo(() => {
    if (!isAuthenticated) {
      return localSchedules;
    }

    const serverToClientIdMap = new Map<string, string>(
      Object.entries(clientToServerIdMap).map(([clientId, serverId]) => [
        serverId,
        clientId,
      ]),
    );

    const serverSchedules = (schedulesQuery ?? []).map((schedule) => {
      const aliasedId = serverToClientIdMap.get(schedule.id);

      if (!aliasedId) {
        return schedule;
      }

      return {
        ...schedule,
        id: aliasedId,
      };
    });

    const serverScheduleIds = new Set(
      serverSchedules.map((schedule) => schedule.id),
    );
    const onlyPending = pendingSchedules.filter(
      (schedule) => !serverScheduleIds.has(schedule.id),
    );

    return [...serverSchedules, ...onlyPending];
  }, [
    isAuthenticated,
    localSchedules,
    schedulesQuery,
    clientToServerIdMap,
    pendingSchedules,
  ]);

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
