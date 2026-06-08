import { useConvexAuth } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import type { SavedSchedule, SavedScheduleInput } from "convex/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIndexedDb } from "src/hooks";
import { IndexedDbKey } from "src/lib/storageKeys";
import { generateId } from "src/lib/utils";
import type { IndexedDbRecordWithoutKey } from "src/types/indexedDb";

const SAVED_SCHEDULES_KEY = IndexedDbKey.SAVED_SCHEDULES_STORE;

type ScheduleIdMap = Record<string, Id<"schedules">>;

function toSavedSchedule(
  id: string,
  schedule: SavedScheduleInput,
  name: string,
  source: string,
): SavedSchedule {
  return {
    id,
    creationTime: Date.now(),
    name,
    source,
    sections: schedule.sections,
  };
}

function mergeAuthenticatedSchedules(
  serverSchedules: SavedSchedule[] | null | undefined,
  pendingSchedules: SavedSchedule[],
  clientToServerIdMap: ScheduleIdMap,
) {
  const serverToClientIdMap = new Map<string, string>(
    Object.entries(clientToServerIdMap).map(([clientId, serverId]) => [
      serverId,
      clientId,
    ]),
  );

  const normalizedServerSchedules = (serverSchedules ?? []).map((schedule) => {
    const aliasedId = serverToClientIdMap.get(schedule.id);

    return aliasedId
      ? {
          ...schedule,
          id: aliasedId,
        }
      : schedule;
  });

  const serverIds = new Set(
    normalizedServerSchedules.map((schedule) => schedule.id),
  );
  const remainingPending = pendingSchedules.filter(
    (schedule) => !serverIds.has(schedule.id),
  );

  return [...normalizedServerSchedules, ...remainingPending];
}

function pruneResolvedPendingSchedules(
  pendingSchedules: SavedSchedule[],
  serverSchedules: SavedSchedule[] | null | undefined,
  clientToServerIdMap: ScheduleIdMap,
) {
  if (pendingSchedules.length === 0 || !serverSchedules) {
    return pendingSchedules;
  }

  const serverIds = new Set(serverSchedules.map((schedule) => schedule.id));

  return pendingSchedules.filter((schedule) => {
    const mappedServerId = clientToServerIdMap[schedule.id];

    if (!mappedServerId) {
      return true;
    }

    return !serverIds.has(mappedServerId);
  });
}

/**
 * Loads saved schedules from Convex when authenticated, otherwise uses IndexedDB.
 * @returns the schedules, a setter and deleter
 * */
export function useSavedSchedule() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  const [pendingSchedules, setPendingSchedules] = useState<SavedSchedule[]>([]);
  const [clientToServerIdMap, setClientToServerIdMap] = useState<ScheduleIdMap>(
    {},
  );
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

  const resolveScheduleId = useCallback(
    (scheduleId: string) =>
      clientToServerIdMap[scheduleId] ?? (scheduleId as Id<"schedules">),
    [clientToServerIdMap],
  );

  const isPendingOnlyScheduleId = useCallback(
    (scheduleId: string) =>
      pendingSchedules.some((schedule) => schedule.id === scheduleId) &&
      !clientToServerIdMap[scheduleId],
    [pendingSchedules, clientToServerIdMap],
  );

  const setSavedSchedule = useCallback(
    (schedule: SavedScheduleInput) => {
      const name = schedule.name ?? "Untitled";
      const source = schedule.source ?? "default";

      if (isLoading) {
        return;
      }

      if (isAuthenticated) {
        const clientScheduleId = generateId();

        setPendingSchedules((prev) => [
          ...prev,
          toSavedSchedule(clientScheduleId, schedule, name, source),
        ]);

        void createSchedule({
          name,
          source,
          sections: schedule.sections,
        })
          .then((createdScheduleId) => {
            if (!createdScheduleId) {
              setPendingSchedules((prev) =>
                prev.filter((s) => s.id !== clientScheduleId),
              );
              return;
            }

            if (pendingDeleteOnCreateRef.current.has(clientScheduleId)) {
              pendingDeleteOnCreateRef.current.delete(clientScheduleId);
              setPendingSchedules((prev) =>
                prev.filter((s) => s.id !== clientScheduleId),
              );
              void removeSchedule({
                scheduleId: createdScheduleId,
              });
              return;
            }

            setClientToServerIdMap((prev) => ({
              ...prev,
              [clientScheduleId]: createdScheduleId,
            }));
          })
          .catch(() => {
            setPendingSchedules((prev) =>
              prev.filter((s) => s.id !== clientScheduleId),
            );
          });
        return;
      }

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
        if (isPendingOnlyScheduleId(scheduleId)) {
          setPendingSchedules((prev) =>
            prev.map((schedule) =>
              schedule.id === scheduleId ? { ...schedule, name } : schedule,
            ),
          );
          return;
        }

        updateSchedule({
          name,
          scheduleId: resolveScheduleId(scheduleId),
        });
        return;
      }

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
      isPendingOnlyScheduleId,
      resolveScheduleId,
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
        if (isPendingOnlyScheduleId(scheduleId)) {
          pendingDeleteOnCreateRef.current.add(scheduleId);
          setPendingSchedules((prev) =>
            prev.filter((s) => s.id !== scheduleId),
          );
          return;
        }

        removeSchedule({
          scheduleId: resolveScheduleId(scheduleId),
        });
        return;
      }

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
      isPendingOnlyScheduleId,
      resolveScheduleId,
      removeSchedule,
      setLocalSavedSchedules,
    ],
  );

  const localSchedules: SavedSchedule[] =
    localSavedSchedules?.savedSchedules ?? [];

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    setPendingSchedules((prev) =>
      pruneResolvedPendingSchedules(prev, schedulesQuery, clientToServerIdMap),
    );
  }, [isAuthenticated, schedulesQuery, clientToServerIdMap]);

  const schedules = useMemo(() => {
    if (!isAuthenticated) {
      return localSchedules;
    }

    return mergeAuthenticatedSchedules(
      schedulesQuery,
      pendingSchedules,
      clientToServerIdMap,
    );
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
