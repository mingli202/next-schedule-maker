import { Class, SharedCurrentClasses } from "@/types";
import isValid from "../search/checkValid";
import { getLocalJsonData } from "@/lib";

const generate = async (
  codes: string[],
  currentClasses: SharedCurrentClasses[],
  colors: string[],
) => {
  const allClasses: Record<string, Class> =
    await getLocalJsonData("allClasses");

  const classes = Object.entries(allClasses).filter(([, cl]) =>
    codes.includes(cl.code),
  );

  let toReturn: SharedCurrentClasses[][] = [currentClasses];

  for (const code of codes) {
    const classesForCode = classes.filter(([, cl]) => cl.code === code);

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
    (s) => s.length === codes.length + currentClasses.length,
  );
};

export default generate;
