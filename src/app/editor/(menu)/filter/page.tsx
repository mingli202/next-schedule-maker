import { Class } from "@/types";
import Form from "./Form";
import { getLocalJsonData } from "@/lib";

const Filter = async () => {
  const allClasses: Record<string, Class> =
    await getLocalJsonData("allClasses");

  return <Form allClasses={allClasses} />;
};

export default Filter;
