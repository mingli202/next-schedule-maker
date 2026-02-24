export const DataFilename = {
  allClasses: "allClasses.json",
  colors: "colors.json",
  professors: "professors.json",
};
export type DataFilename = (typeof DataFilename)[keyof typeof DataFilename];

export default async function getLocalJsonData<T>(name: string): Promise<T> {
  const commit = "0108fb155d2b6bcafbd8fa5301ac4e9166686913";
  const url = `https://raw.githubusercontent.com/mingli202/next-schedule-maker/${commit}/public/json/${name}.json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("fetch failed: " + res.statusText);
  const toReturn: T = await res.json();
  return toReturn;
}
