export const DataFilename = {
  allClasses: "allClasses.json",
  colors: "colors.json",
  professors: "professors.json",
};
export type DataFilename = (typeof DataFilename)[keyof typeof DataFilename];

export const getRemoteJson = async <T>(name: DataFilename): Promise<T> => {
  const url = `https://raw.githubusercontent.com/mingli202/next-schedule-maker/fall2025/public/json/${name}`;

  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error("fetch failed: " + res.statusText);
  const toReturn: T = await res.json();
  return toReturn;
};
