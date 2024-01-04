import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises } from "fs";

async function readLocalJsonFile(name: string) {
  const filePath = path.join(process.cwd(), `public/json/${name}`);
  const res = await promises.readFile(filePath, "utf8");
  const toReturn = JSON.parse(res);
  return toReturn;
}

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const fileName = searchParams.get("file") + ".json";
  const data = await readLocalJsonFile(fileName);

  return NextResponse.json(data);
};
