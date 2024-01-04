import { Class, SharedCurrentClasses } from "@/types";

const isValid = (
  classToCheck: Class,
  scheduleToCompare: SharedCurrentClasses[],
  allClasses: Record<string, Class>,
) => {
  if (scheduleToCompare.length === 0) return true;

  const classToCheckTimes = [
    ...Object.entries(classToCheck.lecture),
    ...Object.entries(classToCheck.lab),
  ].filter(([key]) => !["prof", "title", "rating"].includes(key));

  for (const { id } of scheduleToCompare) {
    const againstClass = allClasses[id];
    if (classToCheck.code === againstClass.code) return false;

    const againstClassTime = [
      ...Object.entries(againstClass.lecture),
      ...Object.entries(againstClass.lab),
    ].filter(([key]) => !["prof", "title", "rating"].includes(key));

    for (const [d1, t1] of classToCheckTimes) {
      if (typeof t1 !== "string") continue;
      const d1Reg = new RegExp(`[${d1}]`, "g");

      for (const [d2, t2] of againstClassTime) {
        if (typeof t2 !== "string") continue;
        const d2Reg = new RegExp(`[${d2}]`, "g");

        if (d1.match(d2Reg) || d2.match(d1Reg)) {
          const [t1Start, t1End] = t1.split("-").map((h) => Number(h));
          const [t2Start, t2End] = t2.split("-").map((h) => Number(h));

          if (
            t1Start === t2Start ||
            t1End === t2End ||
            (t1Start > t2Start && t2End > t1Start) ||
            (t2Start > t1Start && t1End > t2Start)
          ) {
            return false;
          }
        }
      }
    }
  }

  return true;
};

export default isValid;
