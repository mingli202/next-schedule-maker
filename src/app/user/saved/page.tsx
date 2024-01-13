import { getLocalJsonData } from "@/lib";
import View from "@/app/editor/view";
import RightNavbar from "./RightNavbar";
import { Class } from "@/types";

const Page = async () => {
  const colors: string[] = await getLocalJsonData("colors");
  const allClasses: Record<string, Class> =
    await getLocalJsonData("allClasses");

  return (
    <div className="flex h-full w-full gap-4 p-4">
      <div className="basis-3/4 overflow-x-auto overflow-y-hidden max-md:order-1 md:h-full">
        <View className="h-[40rem] min-w-[40rem] md:h-full" readonly />
      </div>
      <div className="basis-1/4 overflow-x-auto overflow-y-hidden max-md:order-2 md:h-full">
        <RightNavbar
          className="min-w-[10rem]"
          colors={colors}
          allClasses={allClasses}
        />
      </div>
    </div>
  );
};

export default Page;
