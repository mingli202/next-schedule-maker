import cn from "./cn";
import { getRemoteJson, DataFilename } from "./getRemoteJson";
import { getSectionTimes } from "./getSectionTimes";

export type RecordValues<T extends Record<string | number | symbol, unknown>> =
  T[keyof T];

export type Self<T> = { new (): T };

export { cn, getRemoteJson, DataFilename, getSectionTimes };
