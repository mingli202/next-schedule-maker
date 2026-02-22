import type { RecordValues } from "@/types";

export const ScheduleOfClasssesVersion = {
  "11/12/2025": "0108fb155d2b6bcafbd8fa5301ac4e9166686913",
} as const;

export type ScheduleOfClasssesVersion = RecordValues<
  typeof ScheduleOfClasssesVersion
>;
