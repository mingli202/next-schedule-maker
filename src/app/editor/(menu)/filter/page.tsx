import { Class } from "@/types";
import Form from "./Form";
import { getRemoteJson } from "@/lib";

async function Filter() {
  const allClasses: Record<string, Class> = await getRemoteJson("allClasses");

  return <Form allClasses={allClasses} />;
}

export default Filter;
