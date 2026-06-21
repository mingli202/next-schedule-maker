import type { QueryClient } from "@tanstack/react-query";
import { z } from "zod";
import type { DataVersionCommit } from "./enums";
import { Section, type SectionsDiff } from "./generated";

export type RecordValues<T extends Record<string | number | symbol, unknown>> =
  T[keyof T];

export type RouterContext = {
  queryClient: QueryClient;
};

export const SectionByIdSchema = z.record(z.string(), Section);
export type SectionByIdSchema = z.infer<typeof SectionByIdSchema>;

export type SectionStore = {
  readonly semester: string;
  readonly filename: string;
  readonly comments: string[];
  readonly sectionsDiff: SectionsDiff;
  readonly sectionsById: Map<string, Section>;
  readonly professors: Set<string>;
  readonly codes: Set<string>;
};

export type DataVersion = {
  name: string;
  commit: DataVersionCommit;
};
