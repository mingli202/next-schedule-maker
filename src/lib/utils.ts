import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...styles: ClassValue[]) => {
  return twMerge(clsx(...styles));
};

export function capitalize(s: string): string {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

// biome-ignore lint/suspicious/noExplicitAny: idk man
export const isFunction = (val: any): val is (...args: any) => any =>
  typeof val === "function";

export function generateId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Helper generic function for sorting
 * */
export function compare<T>(a: T, b: T): number {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}
