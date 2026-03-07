import { getLocalJsonData } from "@/lib";
import SearchBar from "./SearchBar";
import SearchedClasses from "./SearchedClasses";
import { Class } from "@/types";

async function Search() {
  const allClasses: Record<string, Class> =
    await getLocalJsonData("allClasses");

  const professors: string[] = await getLocalJsonData("professors");

  const colors: string[] = await getLocalJsonData("colors");

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
