import { getLocalJsonData } from "@/lib";
import RightNavbar from "./RightNavbar";
import { Class } from "@/types";
import { Metadata } from "next";
import ViewWrapper from "./ViewWrapper";

export const metadata: Metadata = {
  title: "Saved Schedules",
  description: "User Saved Schedules",
  authors: { name: "Ming Li Liu" },
  creator: "Ming Li Liu",
  generator: "Next.js",
  applicationName: "Dream Builder",
  keywords: [
    "Schedule Maker",
    "Schedule Builder",
    "John Abbott College",
    "JAC",
    "Dream Schedule Maker",
    "User saved schedules",
    "Cross Plateform",
    "Account creation",
    "Schedule Planner",
    "Next Js",
    "React",
    "Javascript",
    "JS",
    "TailwindCss",
  ],
};

const Page = async () => {
  const allClasses: Record<string, Class> =
    await getLocalJsonData("allClasses");

  return (
    <div className="h-full w-full overflow-hidden p-2">
      <div className="h-full w-full gap-4 overflow-y-auto md:flex md:h-full md:overflow-hidden">
        <div className="overflow-x-auto overflow-y-hidden max-md:order-1 md:h-full md:basis-3/4">
          <ViewWrapper allClasses={allClasses} />
        </div>
        <div className="overflow-y-hidden max-md:order-2 max-md:mt-2 md:h-full md:basis-1/4 md:overflow-x-auto">
          <RightNavbar
            className="h-full min-w-[10rem]"
            allClasses={allClasses}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
