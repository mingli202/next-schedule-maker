import { AllClasses, Colors, Professors } from "../schemas";

export const DataFilename = {
  allClasses: { filename: "allClasses", schema: AllClasses },
  colors: { filename: "colors", schema: Colors },
  professors: { filename: "professors", schema: Professors },
};
export type DataFilename = (typeof DataFilename)[keyof typeof DataFilename];

export async function getRemoteJson(name: DataFilename) {
  const url = `https://raw.githubusercontent.com/mingli202/next-schedule-maker/fall2025/public/json/${name.filename}.json`;

  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error("fetch failed: " + res.statusText);
  return name.schema.safeParse(await res.json());
}
