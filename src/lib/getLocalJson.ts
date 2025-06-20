export const DataFilename = {
  allClasses: "allClasses.json",
  colors: "colors.json",
  professors: "professors.json",
};
export type DataFilename = (typeof DataFilename)[keyof typeof DataFilename];

export const getLocalJsonData = async <T>(name: string): Promise<T> => {
  const commit = "a712b17dd7c7142cc7e22d66e8fcc0590639a882";
  const url = `https://raw.githubusercontent.com/mingli202/next-schedule-maker/${commit}/public/json/${name}.json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("fetch failed: " + res.statusText);
  const toReturn: T = await res.json();
  return toReturn;
};
