import { getRemoteJson } from "@/lib";
import SavedSchedules from "./SavedShedules";
import { Class } from "@/types";
import LoginStateObserver from "./LoginStateObserver";

async function Saved() {
  const allClasses: Record<string, Class> = await getRemoteJson("allClasses");

  return (
    <LoginStateObserver>
      <SavedSchedules allClasses={allClasses} />
    </LoginStateObserver>
  );
}

export default Saved;
