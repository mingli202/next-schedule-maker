export const SessionStorageKey = {
  AUTOBUILDER_OPTIONS: "autobuilder-options",
  AUTOBUILDER_GENERATION_CACHE_METADATA:
    "autobuilder-generation-cache-metadata",
} as const;

export const LocalStorageKey = {
  SAVED_SCHEDULES: "saved-schedules",
} as const;

export const IndexedDbKey = {
  GENERATED_SCHEDULES_CACHE_STORE: "generated-schedules-cache",
  SAVED_SCHEDULES_STORE: "saved-schedules-store",
} as const;
