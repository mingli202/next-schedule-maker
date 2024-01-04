import { getLocalJsonData } from "@/lib";
import SavedSchedules from "./SavedShedules";
import { Class } from "@/types";

const Saved = async () => {
  const allClasses: Record<string, Class> =
    await getLocalJsonData("fall-classes");

  return (
    <>
      <SavedSchedules allClasses={allClasses} />
    </>
  );
};

export default Saved;
