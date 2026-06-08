import type { QueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Section } from "./generated";

export type RecordValues<T extends Record<string | number | symbol, unknown>> =
  T[keyof T];

export type RouterContext = {
  queryClient: QueryClient;
};

export const SectionByIdSchema = z.record(z.string(), Section);
export type SectionByIdSchema = z.infer<typeof SectionByIdSchema>;

export type SectionStore = {
  readonly sectionsById: Map<string, Section>;
  readonly professors: Set<string>;
  readonly codes: Set<string>;
};
