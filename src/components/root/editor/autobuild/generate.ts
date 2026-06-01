import { getNextAvailableColorIndex } from "src/lib/colors";
import { Iter } from "src/lib/iter";
import {
  filterByCode,
  filterByDaysOff,
  filterByMaxRating,
  filterByMaxScore,
  filterByMinRating,
  filterByMinScore,
  filterByProfessors,
  filterByTimeEnd,
  filterByTimeStart,
} from "src/lib/schedule/filterDown";
import isValidAdditionToSchedule from "src/lib/schedule/isValidAdditionToSchedule";
import type { SectionStore } from "src/types";
import type { Code } from "src/types/autobuild";
import type { SavedSection } from "src/types/schedule";

export default async function generate(
  codes: Code[],
  currentSections: SavedSection[],
  useCurrent: boolean,
  dayOff: string[],
  time: [string, string],
  sectionsById: SectionStore["sectionsById"],
) {
  const sections = Iter.from(sectionsById.values()).filter((section) =>
    codes.some((c) => c.code === section.code),
  );

  let toReturn: Iter<SavedSection[]> = useCurrent
    ? Iter.from([currentSections])
    : Iter.from([[]]);

  for (const code of codes) {
    let sectionsForCode = filterByCode(sections, code.code);

    sectionsForCode = filterByDaysOff(sectionsForCode, dayOff.join(""));
    sectionsForCode = filterByTimeStart(sectionsForCode, time[0]);
    sectionsForCode = filterByTimeEnd(sectionsForCode, time[1]);

    if (code.professors) {
      sectionsForCode = filterByProfessors(sectionsForCode, code.professors);
    }

    if (code.ratingRange) {
      if (code.ratingRange.to) {
        sectionsForCode = filterByMaxRating(
          sectionsForCode,
          code.ratingRange.to,
        );
      }
      if (code.ratingRange.from) {
        sectionsForCode = filterByMinRating(
          sectionsForCode,
          code.ratingRange.from,
        );
      }
    }

    if (code.scoreRange) {
      if (code.scoreRange.to) {
        sectionsForCode = filterByMaxScore(sectionsForCode, code.scoreRange.to);
      }
      if (code.scoreRange.from) {
        sectionsForCode = filterByMinScore(
          sectionsForCode,
          code.scoreRange.from,
        );
      }
    }

    toReturn = toReturn.flatMap((sch) => {
      const schedule = sch
        .map((s) => sectionsById.get(s.sectionId))
        .filter((s) => s !== undefined);

      const validSections = sectionsForCode.filter((section) =>
        isValidAdditionToSchedule(section, schedule),
      );

      const v = validSections.map((section) => {
        const colorIndex = getNextAvailableColorIndex(sch);
        return [...sch, { sectionId: section.id, colorIndex }];
      });

      return v;
    });
  }

  return toReturn.filter(
    (s) =>
      s.length === codes.length + currentSections.length * (useCurrent ? 1 : 0),
  );
}
