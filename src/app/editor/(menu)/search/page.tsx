import { getRemoteJson } from "@/lib";
import SearchBar from "./SearchBar";
import SearchedClasses from "./SearchedClasses";
import { Class } from "@/types";

async function Search() {
  const allClasses: Record<string, Class> = await getRemoteJson("allClasses");

  const professors: string[] = await getRemoteJson("professors");

  const colors: string[] = await getRemoteJson("colors");

  return (
    <>
      <SearchBar />
      <SearchedClasses
        allClasses={allClasses}
        professors={professors}
        colors={colors}
      />
    </>
  );
}

export default Search;
