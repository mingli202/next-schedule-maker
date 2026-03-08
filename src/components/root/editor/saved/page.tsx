import { getLocalJsonData } from "@/lib";
import SavedSchedules from "./SavedShedules";
import { Class } from "@/types";
import LoginStateObserver from "./LoginStateObserver";

async function Saved() {
  const allClasses: Record<string, Class> =
    await getLocalJsonData("allClasses");

  return (
    <LoginStateObserver>
      <SavedSchedules allClasses={allClasses} />
    </LoginStateObserver>
  );
}

export default Saved;
