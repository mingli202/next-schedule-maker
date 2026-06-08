import type { DayTime, Section } from "src/types/generated";

/**
 * Test whether a section to be added to a schedule will
 * not overlap any other sections
 * */
export default function isValidAdditionToSchedule(
  sectionToCheck: Section,
  schedule: Section[],
) {
  if (schedule.length === 0) return true;

  return schedule.every((section) => {
    if (section.code === sectionToCheck.code) return false;

    const dayTimes1 = sectionToCheck.leclabs.flatMap((l) => l.dayTimes);
    const dayTimes2 = section.leclabs.flatMap((l) => l.dayTimes);

    return isValidDayTimes([...dayTimes1, ...dayTimes2]);
  });
}

/**
 * Check if the given dayTimes array are all non-overlapping
 * */
export function isValidDayTimes(dayTimes: DayTime[]): boolean {
  for (let i = 0; i < dayTimes.length; i++) {
    for (let k = i + 1; k < dayTimes.length; k++) {
      if (isOverlap(dayTimes[i], dayTimes[k])) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Check if the two given day times overlap each other
 * They overlap each other if they have at least one day they share in common
 * and that their times are overlapping
 * */
export function isOverlap(dayTime1: DayTime, dayTime2: DayTime): boolean {
  const { day: day1, startTimeHhmm: t1Start, endTimeHhmm: t1End } = dayTime1;
  const { day: day2, startTimeHhmm: t2Start, endTimeHhmm: t2End } = dayTime2;

  if (!day1.split("").some((c) => day2.includes(c))) return false;

  return (
    t1Start === t2Start ||
    t1End === t2End ||
    (t1Start > t2Start && t2End > t1Start) ||
    (t2Start > t1Start && t1End > t2Start)
  );
}
