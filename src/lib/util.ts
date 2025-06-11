import { Class } from "@/types";

export function getSectionTimes(section: Class): string[][] {
  let times: string[][] = [];

  if (section.lecture) {
    const time = Object.entries(section.lecture.time).flatMap(([d, ts]) =>
      ts.map((t) => [d, t]),
    );
    times = [...times, ...time];
  }

  if (section.lab) {
    const time = Object.entries(section.lab.time).flatMap(([d, ts]) =>
      ts.map((t) => [d, t]),
    );
    times = [...times, ...time];
  }

  return times;
}
