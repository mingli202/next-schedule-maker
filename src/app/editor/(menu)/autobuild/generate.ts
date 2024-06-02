import { Class, Code, SharedCurrentClasses } from "@/types";
import isValid from "../search/checkValid";
import { getLocalJsonData } from "@/lib";

async function generate(
  codes: Code[],
  currentClasses: SharedCurrentClasses[],
  colors: string[],
  useCurrent: boolean,
  dayOff: string[],
  time: [string, string],
) {
  const allClasses: Record<string, Class> =
    await getLocalJsonData("allClasses");

  const classes = Object.entries(allClasses).filter(([, cl]) =>
    codes.some((c) => c.code === cl.code),
  );

  let toReturn: SharedCurrentClasses[][] = useCurrent ? [currentClasses] : [[]];

  for (const code of codes) {
    const classesForCode = classes.filter(([, cl]) => {
      if (cl.code !== code.code) {
        return false;
      }

      if (dayOff.length > 0) {
        const tArr = [...Object.keys(cl.lecture), ...Object.keys(cl.lab)]
          .filter((key) => !["prof", "title", "rating"].includes(key))
          .join("");

        if (dayOff.some((d) => tArr.includes(d))) {
          return false;
        }
      }

      if (time[0] !== "00:00" || time[1] !== "23:59") {
        const tArr = [
          ...Object.entries(cl.lecture),
          ...Object.entries(cl.lab),
        ].filter(([key]) => !["prof", "title", "rating"].includes(key));

        const start = time[0].replace(":", "") ?? "0";
        const end = time[1].replace(":", "") ?? "2400";

        const rightTime = tArr.every(([, t]) => {
          const [tStart, tEnd] = t
            .toString()
            .split("-")
            .map((t) => Number(t));

          return tStart >= Number(start) && tEnd <= Number(end);
        });

        if (!rightTime) {
          return false;
        }
      }

      if (code.professors && code.professors.length > 0) {
        if (
          !code.professors.includes(cl.lecture.prof) &&
          !code.professors.includes(cl.lab.prof)
        ) {
          return false;
        }
      }

      if (code.ratingRange) {
        const { to, from } = code.ratingRange;

        const { avg } = cl.lecture.rating;

        if (to && to < avg) {
          return false;
        }
        if (from && from > avg) {
          return false;
        }
      }

      if (code.scoreRange) {
        const { to, from } = code.scoreRange;

        const { score } = cl.lecture.rating;

        if (to && to < score) {
          return false;
        }
        if (from && from > score) {
          return false;
        }
      }

      return true;
    });

    toReturn = toReturn.flatMap((schedule) => {
      const validClasses = classesForCode.filter(([, cl]) =>
        isValid(cl, schedule, allClasses),
      );

      const v = validClasses.map(([id]) => {
        let bgColor = "";
        let textColor = "#000";
        const pickedColors = schedule.map((cl) => cl.bgColor);

        for (let i = 0; i < colors.length; i++) {
          if (!pickedColors.includes(colors[i])) {
            if (i > 7) textColor = "#FFF";
            bgColor = colors[i];
            break;
          }
        }
        return [...schedule, { id, textColor, bgColor }];
      });

      return v;
    });
  }

  return toReturn.filter(
    (s) =>
      s.length === codes.length + currentClasses.length * (useCurrent ? 1 : 0),
  );
}

export default generate;
