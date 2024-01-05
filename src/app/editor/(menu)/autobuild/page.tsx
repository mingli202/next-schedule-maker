import { getLocalJsonData } from "@/lib";
import Autobuild from "./Autobuild";
import { Class } from "@/types";

const Page = async () => {
  const allClasses: Record<string, Class> =
    await getLocalJsonData("allClasses");

  const colors: string[] = await getLocalJsonData("colors");

  return <Autobuild allClasses={allClasses} colors={colors} />;
};

export default Page;
