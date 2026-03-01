import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...styles: ClassValue[]) => {
  return twMerge(clsx(...styles));
};
