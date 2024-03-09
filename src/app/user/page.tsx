import { getLocalJsonData } from "@/lib";
import Banner from "./Banner";
import FollowingsPreview from "./FollowingsPreview";
import SavedPreview from "./SavedPreview";
import { Class } from "@/types";

const Page = async () => {
  const allClasses: Record<string, Class> =
    await getLocalJsonData("allClasses");

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <Banner className="shrink-0" />
      <div className="flex w-full basis-full gap-4 overflow-hidden">
        <SavedPreview
          className="box-border h-fit max-h-full basis-2/3 rounded-md border border-solid border-third p-4"
          allClasses={allClasses}
        />
        <FollowingsPreview className="box-border h-fit max-h-full basis-1/3 rounded-md border border-solid border-third p-4" />
      </div>
    </div>
  );
};

export default Page;
