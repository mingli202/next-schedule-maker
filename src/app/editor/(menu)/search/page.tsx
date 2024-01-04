import { getLocalJsonData } from "@/lib";
import SearchBar from "./SearchBar";
import SearchedClasses from "./SearchedClasses";
import { Class } from "@/types";

const Search = async () => {
  const allClasses: Record<string, Class> =
    await getLocalJsonData("fall-classes");

  const professors: string[] = await getLocalJsonData("fall-professors");

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
};

export default Search;
