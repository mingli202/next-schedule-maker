import { getRemoteJson } from "@/lib";
import Autobuild from "./Autobuild";
import { Class } from "@/types";

async function Page() {
  const allClasses: Record<string, Class> = await getRemoteJson("allClasses");

  const colors: string[] = await getRemoteJson("colors");

  return <Autobuild allClasses={allClasses} colors={colors} />;
}

export default Page;
