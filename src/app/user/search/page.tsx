import UserCard from "./UserCard";
import Search from "./Search";
import { getLocalJsonData } from "@/lib";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Page = async () => {
  const colors: string[] = await getLocalJsonData("colors");
  const disable = true;

  return (
    <>
      {disable ? (
        <div className="flex h-full w-full items-center justify-center">
          <p className="max-w-2xl shrink-0 text-center">
            Regrettably this feature will not be implemented since it would
            require too many downloads from the database and it would cost money
            for this otherwise free app.
          </p>
          <FontAwesomeIcon icon={faFrown} />
        </div>
      ) : (
        <div className="flex h-full basis-full gap-4 overflow-hidden p-4">
          <Search className="h-full basis-1/3" />
          <UserCard className="basis-2/3" colors={colors} />
        </div>
      )}
    </>
  );
};

export default Page;
