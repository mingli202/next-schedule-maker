import { Section } from "../schemas/pdf";

export function getSectionTimes(
  section: Section,
  leclab?: "lecture" | "lab",
): string[][] {
  let times: string[][] = [];

  if (section.lecture && (!leclab || leclab === "lecture")) {
    const time = Object.entries(section.lecture.time).flatMap(([d, ts]) =>
      ts.map((t) => [d, t]),
    );
    times = [...times, ...time];
  }

  if (section.lab && (!leclab || leclab === "lab")) {
    const time = Object.entries(section.lab.time).flatMap(([d, ts]) =>
      ts.map((t) => [d, t]),
    );
    times = [...times, ...time];
  }

  return times;
}
