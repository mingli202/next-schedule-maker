import { getLocalJsonData } from "@/lib";
import { Class } from "@/types";
import UserCard from "./UserCard";

type Props = {
  params: {
    uid: string;
  };
};

const Page = async ({ params }: Props) => {
  const allClasses: Record<string, Class> =
    await getLocalJsonData("allClasses");

  return <UserCard allClasses={allClasses} uid={params.uid} />;
};

export default Page;
