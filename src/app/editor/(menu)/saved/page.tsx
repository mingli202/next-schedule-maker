import { getLocalJsonData } from "@/lib";
import SavedSchedules from "./SavedShedules";
import { Class } from "@/types";
import LoginStateObserver from "./LoginStateObserver";

const Saved = async () => {
  const allClasses: Record<string, Class> =
    await getLocalJsonData("allClasses");

  const colors: string[] = await getLocalJsonData("colors");

  return (
    <LoginStateObserver>
      <SavedSchedules allClasses={allClasses} colors={colors} />
    </LoginStateObserver>
  );
};

export default Saved;
