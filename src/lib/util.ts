import type { Time } from "@/types/generated";

export function getSectionTimes(times: Time): string[][] {
  return Object.entries(times).flatMap(([day, time]) =>
    time.map((t) => [day, t]),
  );
}

export function capitalize(s: string): string {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}
