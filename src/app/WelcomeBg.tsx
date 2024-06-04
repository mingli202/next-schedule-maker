import { getLocalJsonData } from "@/lib";
import { Class } from "@/types";
import BgAnimation from "./BgAnimation";

async function Bg() {
  const allClasses: Record<string, Class> =
    await getLocalJsonData("allClasses");

  return <BgAnimation allClasses={allClasses} />;
}

export default Bg;
