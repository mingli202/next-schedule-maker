const getLocalJsonData = async <T>(name: string): Promise<T> => {
  const url = `https://raw.githubusercontent.com/mingli202/next-schedule-maker/main/public/json/${name}.json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("fetch failed: " + res.statusText);
  const toReturn: T = await res.json();
  return toReturn;
};

export default getLocalJsonData;
