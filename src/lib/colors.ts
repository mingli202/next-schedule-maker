import z from "zod";

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
] as const;

export const SectionColor = z.object({
  textColor: z.string(),
  bgColor: z.string(),
});
export type SectionColor = z.infer<typeof SectionColor>;

export function getColorFromIndex(colorIndex: number): SectionColor {
  if (colorIndex < 0 || colorIndex >= colors.length) {
    return { textColor: "#000", bgColor: "#FFF" };
  }

  return {
    textColor: colorIndex > 7 ? "#FFF" : "#000",
    bgColor: colors[colorIndex],
  };
}
