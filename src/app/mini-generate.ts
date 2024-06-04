import { Class, Code, SharedCurrentClasses } from "@/types";
import isValid from "./editor/(menu)/search/checkValid";

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

const colors = [
  "#ff7a7a",
  "#ffbd7a",
  "#e9ff7a",
  "#91ff7a",
  "#7affe9",
  "#7aadff",
  "#b37aff",
  "#ff7ade",
  "#990000",
  "#994d00",
  "#7f9900",
  "#1a9900",
  "#009980",
  "#003b99",
  "#400099",
  "#990073",
  "#4d4d4d",
];

function miniGenerate(allClasses: Record<string, Class>) {
  const allCodes = Object.fromEntries(
    Object.entries(prefix).map(([n, p]) => [n, getCodes(allClasses, p)]),
  );

  const program = programs[Math.floor(Math.random() * programs.length)];

  const n = Math.floor(Math.random() * 3 + 5);

  const nCore = Math.ceil(n / 2);

  const coreCodes = [
    ...Array(nCore)
      .fill(0)
      .map(
        () =>
          allCodes[program][
            Math.floor(Math.random() * allCodes[program].length)
          ],
      ),
  ];

  const generalClasses = ["english", "humanities", "french", "complementary"];

  const generalCodes = [];
  for (let i = 0; i < n - nCore; i++) {
    generalCodes.push(generalClasses[i]);
  }
  const g = generalCodes.map(
    (c) => allCodes[c][Math.floor(Math.random() * allCodes[c].length)],
  );

  const codes = [...coreCodes, ...g].map((code) => {
    return {
      code,
    };
  });

  return generate(codes, colors, allClasses);
}

function getCodes(data: Record<string, Class>, prefix = "") {
  return [
    ...new Set(
      Object.values(data)
        .filter(
          (d) =>
            (d.code.startsWith(prefix) || d.program.startsWith(prefix)) &&
            d.code !== "101-DDJ-AB",
        )
        .map((d) => d.code),
    ),
  ];
}

function generate(
  codes: Code[],
  colors: string[],
  allClasses: Record<string, Class>,
) {
  const classes = Object.entries(allClasses).filter(([, cl]) =>
    codes.some((c) => c.code === cl.code),
  );

  let toReturn: SharedCurrentClasses[] = [];

  for (const code of codes) {
    const classesForCode = classes.filter(([, cl]) => {
      if (cl.code !== code.code) {
        return false;
      }

      return true;
    });

    const validClasses = classesForCode.filter(([, cl]) =>
      isValid(cl, toReturn, allClasses),
    );

    if (validClasses.length === 0) {
      return [];
    }

    const next = validClasses[Math.floor(Math.random() * validClasses.length)];

    let bgColor = "";
    let textColor = "#000";
    const pickedColors = toReturn.map((cl) => cl.bgColor);

    for (let i = 0; i < colors.length; i++) {
      if (!pickedColors.includes(colors[i])) {
        if (i > 7) textColor = "#FFF";
        bgColor = colors[i];
        break;
      }
    }

    toReturn = [...toReturn, { id: next[0], textColor, bgColor }];
  }

  return toReturn;
}

export default miniGenerate;
