export function withoutUndefined<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined),
  ) as T;
}

/**
 * Duration in miliseconds
 */
export type Duration = number;
export const SECOND: Duration = 1000;
export const MINUTE: Duration = SECOND * 60;
export const HOUR: Duration = MINUTE * 60;
export const DAY: Duration = HOUR * 24;
