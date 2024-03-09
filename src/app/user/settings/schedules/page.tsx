import { getLocalJsonData } from "@/lib";
import styles from "../styles.module.css";
import PublicSchedules from "./PublicSchedules";
import { Class } from "@/types";

const Page = async () => {
  const allClasses: Record<string, Class> =
    await getLocalJsonData("allClasses");

  return (
    <div className="relative flex h-full w-full flex-col gap-2 rounded-md bg-black/30 p-3 shadow-[rgba(156,205,220,0.24)_0px_3px_8px]">
      <div className="shrink-0">
        <h1 className="font-heading text-3xl">Schedule Showcase</h1>
        <p className={styles.desc}>
          Click to add schedules that you want to share to others
        </p>
      </div>

      <div className="h-0.5 w-full shrink-0 rounded-full bg-third/50" />

      <PublicSchedules allClasses={allClasses} className="w-full basis-full" />
    </div>
  );
};

export default Page;
