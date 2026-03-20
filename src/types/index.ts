import type { QueryClient } from "@tanstack/react-query";
import type { SectionResponse } from "src/client";

export type RecordValues<T extends Record<string | number | symbol, unknown>> =
  T[keyof T];

export type RouterContext = {
  queryClient: QueryClient;
};

export type SectionStore = {
  readonly sectionsById: Map<number, SectionResponse>;
  readonly professors: Set<string>;
  readonly codes: Set<string>;
};
