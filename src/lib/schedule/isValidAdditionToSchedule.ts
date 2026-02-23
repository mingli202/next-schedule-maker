import type { DayTimeResponse, SectionResponse } from "@/client";

export default function isValidAdditionToSchedule(
  sectionToCheck: SectionResponse,
  schedule: SectionResponse[],
) {
  if (schedule.length === 0) return true;

  return schedule.every((section) => {
    if (section.code === sectionToCheck.code) return false;

    const dayTimes1 = sectionToCheck.leclabs.flatMap((l) => l.dayTimes);
    const dayTimes2 = section.leclabs.flatMap((l) => l.dayTimes);

    return isValidDayTimes([...dayTimes1, ...dayTimes2]);
  });
}

export function isValidDayTimes(dayTimes: DayTimeResponse[]): boolean {
  const byDay: Record<string, DayTimeResponse[]> = dayTimes.reduce(
    (acc, dayTime) => {
      if (!(dayTime.day in acc)) {
        acc[dayTime.day] = [];
      }

      acc[dayTime.day] = [...acc[dayTime.day], dayTime];
      return acc;
    },
    {} as Record<string, DayTimeResponse[]>,
  );

  for (const dayTimesByDay of Object.values(byDay)) {
    for (let i = 0; i < dayTimesByDay.length; i++) {
      for (let k = i + 1; k < dayTimesByDay.length; k++) {
        if (isOverlap(dayTimesByDay[i], dayTimesByDay[k])) {
          return false;
        }
      }
    }
  }

  return true;
}

export function isOverlap(
  dayTime1: DayTimeResponse,
  dayTime2: DayTimeResponse,
): boolean {
  const { startTimeHhmm: t1Start, endTimeHhmm: t1End } = dayTime1;
  const { startTimeHhmm: t2Start, endTimeHhmm: t2End } = dayTime2;

  return (
    t1Start === t2Start ||
    t1End === t2End ||
    (t1Start > t2Start && t2End > t1Start) ||
    (t2Start > t1Start && t1End > t2Start)
  );
}
