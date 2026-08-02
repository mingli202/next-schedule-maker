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

/**
 * returns a pretty string of the given timestamp
 * */
export default function parseTimestamp(timestamp: number): string {
  const nowMs = Date.now();

  const diffS = Math.max(nowMs - timestamp, 0) / 1000;

  // less than a minute ago
  if (diffS < 60) {
    return `${Math.floor(diffS)}s ago`;
  }
  if (diffS < 60 * 60) {
    return `${Math.floor(diffS / 60)}min ago`;
  }
  if (diffS < 60 * 60 * 24) {
    return `${Math.floor(diffS / 60 / 60)}hr ago`;
  }
  if (diffS < 60 * 60 * 24 * 7) {
    return `${Math.floor(diffS / 60 / 60 / 24)}d ago`;
  }
  if (diffS < 60 * 60 * 24 * 30) {
    return `${Math.floor(diffS / 60 / 60 / 24 / 7)} weeks ago`;
  }

  const date = new Date(timestamp);

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
