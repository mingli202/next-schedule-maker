import { z } from "zod/v4";
import { AllClasses, Colors, Professors } from "../schemas/pdf";
import { SemesterNames } from "./semesterNames";
import { Err, Ok, Result } from "./result";
import { RecordValues } from ".";

export const DataFilename = {
  allClasses: { filename: "allClasses", schema: AllClasses },
  colors: { filename: "colors", schema: Colors },
  professors: { filename: "professors", schema: Professors },
};
export type DataFilename = RecordValues<typeof DataFilename>;

export async function getRemoteJson<
  T extends z.output<AllClasses | Colors | Professors>,
>(name: DataFilename): Promise<Result<T, string>> {
  const url = `https://raw.githubusercontent.com/mingli202/next-schedule-maker/${SemesterNames.Current}/public/json/${name.filename}.json`;

  const res = await fetch(url, { cache: "no-cache" });

  if (!res.ok)
    return new Err(`failted to fetch ${name} from github: ${res.statusText}`);

  const safeParseRes = name.schema.safeParse(await res.json());

  if (safeParseRes.success) {
    return new Ok(safeParseRes.data as T);
  }

  return new Err(safeParseRes.error.message);
}
