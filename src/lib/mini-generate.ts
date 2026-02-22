import type { SectionResponse } from "@/client";
import type { SavedSection } from "@/types/schedule";
import { getNextAvailableColorIndex } from "./colors";
import isValidAdditionToSchedule from "./schedule/isValidAdditionToSchedule";
import { getSectionFromSortedListWithId } from "./util";

const prefix = {
  french: "602",
  english: "603",
  humanities: "345",
  complementary: "Complementary",
  science: "Science",
  social: "Social",
  visual: "Visual",
  alc: "Arts",
};

const programs = [
  ...Array(2).fill("alc"),
  ...Array(50).fill("science"),
  ...Array(50).fill("social"),
  ...Array(2).fill("visual"),
];

function miniGenerate(allSections: SectionResponse[]) {
  const allCodes = Object.fromEntries(
    Object.entries(prefix).map(([n, p]) => [n, getCodes(allSections, p)]),
  );

  const program = programs[Math.floor(Math.random() * programs.length)];

  const n = Math.floor(Math.random() * 3 + 5);

  const nCore = Math.ceil(n / 2);

  const coreCodes = Array(nCore)
    .fill(0)
    .map(
      () =>
        allCodes[program][Math.floor(Math.random() * allCodes[program].length)],
    );

  const generalClasses = ["english", "humanities", "french", "complementary"];

  const generalCodes = [];
  for (let i = 0; i < n - nCore; i++) {
    generalCodes.push(generalClasses[i]);
  }
  const g = generalCodes.map(
    (c) => allCodes[c][Math.floor(Math.random() * allCodes[c].length)],
  );

  const codes = [...coreCodes, ...g];

  return generate(codes, allSections);
}

function getCodes(allSections: SectionResponse[], prefix = "") {
  return [
    ...new Set(
      allSections
        .filter(
          (d) =>
            (d.code.startsWith(prefix) || d.course.startsWith(prefix)) &&
            d.code !== "120-DAC-AB",
        )
        .map((d) => d.code),
    ),
  ];
}

function generate(codes: string[], allSections: SectionResponse[]) {
  const sections = allSections.filter((section) =>
    codes.some((c) => c === section.code),
  );

  let toReturn: SavedSection[] = [];

  for (const code of codes) {
    const classesForCode = sections.filter((section) => section.code === code);

    const schedule = toReturn
      .map((section) =>
        getSectionFromSortedListWithId(section.sectionId, allSections),
      )
      .filter((section) => !!section);

    const validClasses = classesForCode.filter((section) =>
      isValidAdditionToSchedule(section, schedule),
    );

    if (validClasses.length === 0) {
      return [];
    }

    const next = validClasses[Math.floor(Math.random() * validClasses.length)];
    const nextColorIndex = getNextAvailableColorIndex(toReturn);

    toReturn = [
      ...toReturn,
      { sectionId: next.id, colorIndex: nextColorIndex },
    ];
  }

  return toReturn;
}

export default miniGenerate;
