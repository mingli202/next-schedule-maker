import { cn, getLocalJsonData } from "@/lib";
import PublicSchedules from "./PublicSchedules";
import { Class } from "@/types";

async function Page() {
  alert(
    "The data will be updated for WINTER 2025 after I'm done with my finals (last day is December 19). I also plan on making a few changes such as removing the need to login to save schedules and save them locally on your browser. I promise I will update it at least one week before the first day of registration, so before December 27. Thanks for understanding!",
  );

  const allClasses: Record<string, Class> =
    await getLocalJsonData("allClasses");

  return (
    <div className="relative flex h-full w-full flex-col gap-2 rounded-md bg-black/30 p-3 shadow-[rgba(156,205,220,0.24)_0px_3px_8px]">
      <div className="shrink-0">
        <h1 className="font-heading text-xl md:text-3xl">Schedule Showcase</h1>
        <p className={cn("text-xs text-text/70 md:text-sm")}>
          Click to add schedules that you want to share to others
        </p>
      </div>

      <div className="h-0.5 w-full shrink-0 rounded-full bg-third/50" />

      <PublicSchedules allClasses={allClasses} className="w-full basis-full" />
    </div>
  );
}

export default Page;
