import { getLocalJsonData } from "@/lib";
import Banner from "./Banner";
import FollowingsPreview from "./FollowingsPreview";
import SavedPreview from "./SavedPreview";
import { Class } from "@/types";

const Page = async () => {
  const allClasses: Record<string, Class> =
    await getLocalJsonData("allClasses");

  return (
    <div className="flex w-full basis-full flex-col gap-2 overflow-hidden p-2 md:h-full md:gap-4 md:p-4">
      <Banner className="shrink-0" />
      <div className="flex w-full basis-full gap-2 overflow-hidden max-md:flex-col md:gap-4">
        <SavedPreview
          className="box-border h-full basis-2/3 overflow-hidden rounded-md border border-solid border-third p-2 md:h-fit md:max-h-full md:p-4"
          allClasses={allClasses}
        />
        <FollowingsPreview className="box-border basis-1/3 rounded-md border border-solid border-third p-2 md:h-fit md:max-h-full md:p-4" />
      </div>
    </div>
  );
};

export default Page;
