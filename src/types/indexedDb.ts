import { SavedSchedule } from "convex/types";
import { IndexedDbKey } from "src/lib/storageKeys";
import { z } from "zod";
import type { RecordValues } from ".";
import { SavedSection } from "./schedule";

const IndexedDbSchemaValueBase = z.object({
  key: z.string(),
  updatedAt: z.number(),
});

export const IndexedDbSchema = {
  [IndexedDbKey.GENERATED_SCHEDULES_CACHE_STORE]: z.object({
    ...IndexedDbSchemaValueBase.shape,
    schedules: z.array(z.array(SavedSection)),
  }),
  [IndexedDbKey.SAVED_SCHEDULES_STORE]: z.object({
    ...IndexedDbSchemaValueBase.shape,
    savedSchedules: z.array(SavedSchedule),
  }),
} as const;

export type IndexedDbStoreName = RecordValues<typeof IndexedDbKey>;
export type IndexedDbRecord<T extends IndexedDbStoreName> = z.infer<
  (typeof IndexedDbSchema)[T]
>;

export type IndexedDbRecordWithoutKey<T extends IndexedDbStoreName> = Omit<
  IndexedDbRecord<T>,
  "key" | "updatedAt"
>;
