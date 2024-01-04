const getLocalJsonData = async <T>(name: string): Promise<T> => {
  const url = process.env.URL + `/json?file=${name}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("fetch failed: " + res.statusText);
  const toReturn = res.json();
  return toReturn;
};

export default getLocalJsonData;
