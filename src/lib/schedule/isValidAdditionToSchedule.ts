import type { SectionResponse } from "@/client";

export default function isValidAdditionToSchedule(
  sectionToCheck: SectionResponse,
  schedule: SectionResponse[],
) {
  if (schedule.length === 0) return true;

  for (const section of schedule) {
    if (section.code === sectionToCheck.code) return false;

    const dayTimes1 = sectionToCheck.leclabs.flatMap((l) => l.dayTimes);
    const dayTimes2 = section.leclabs.flatMap((l) => l.dayTimes);

    for (const {
      day: d1,
      startTimeHhmm: t1Start,
      endTimeHhmm: t1End,
    } of dayTimes1) {
      const d1Reg = new RegExp(`[${d1}]`, "g");

      for (const {
        day: d2,
        startTimeHhmm: t2Start,
        endTimeHhmm: t2End,
      } of dayTimes2) {
        const d2Reg = new RegExp(`[${d2}]`, "g");

        if (
          (d1.match(d2Reg) || d2.match(d1Reg)) &&
          (t1Start === t2Start ||
            t1End === t2End ||
            (t1Start > t2Start && t2End > t1Start) ||
            (t2Start > t1Start && t1End > t2Start))
        ) {
          return false;
        }
      }
    }
  }

  return true;
}
