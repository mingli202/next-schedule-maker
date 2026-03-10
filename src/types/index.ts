import type { QueryClient } from "@tanstack/react-query";

export type RecordValues<T extends Record<string | number | symbol, unknown>> =
  T[keyof T];

export type RouterContext = {
  queryClient: QueryClient;
};
