import { env, httpAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { ParsedPdf } from "../types.generated";
import { NewUpload, OfficialUploadData } from "../types";
import { GenericActionCtx } from "convex/server";
import { corsHeaders } from "../cors";

/**
 * hash the given file
 * */
async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const postUpload = httpAction(async (ctx, req) => {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "no file uploaded" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return Response.json({ error: "File is not a pdf" }, { status: 400 });
  }

  const hash = await hashFile(file);

  let upload = await ctx.runMutation(
    internal.uploads.mutations.getUploadFromHash,
    {
      hash,
    },
  );

  if (!upload) {
    upload = await newUpload(ctx, formData, file.name, hash);
  }

  await newUserOrOfficialUpload(ctx, upload, file.name, formData);

  return new Response(null, {
    status: 200,
    headers: { ...corsHeaders },
  });
});

/**
 * store in db a new user upload with the given existing upload
 * */
async function newUserOrOfficialUpload(
  ctx: GenericActionCtx<any>,
  upload: NewUpload,
  displayName: string,
  formData: FormData,
) {
  const officialUploadData = getOfficialUploadData(formData);

  await ctx.runMutation(internal.uploads.mutations.newUserUpload, {
    uploadId: upload.uploadId,
    displayName,
    officialUploadData,
  });
}

/**
 * store in db a new upload and user upload
 * will fetch from fastapi backend to parse the data
 * */
async function newUpload(
  ctx: GenericActionCtx<any>,
  formData: FormData,
  displayName: string,
  hash: string,
) {
  const parsedPdf = await getParsedPdf(formData);
  const sectionsBlob = toBlob(parsedPdf.sectionsById);
  const storageId = await ctx.storage.store(sectionsBlob);

  return await ctx.runMutation(internal.uploads.mutations.newUpload, {
    semester: parsedPdf.semester,
    storageId,
    displayName,
    hash,
  });
}

/**
 *
 * @param formData containing the file data
 * @returns the parsed pdf
 */
async function getParsedPdf(formData: FormData): Promise<ParsedPdf> {
  const fileOnlyFormdata = new FormData();
  fileOnlyFormdata.set("file", formData.get("file")!);

  const url = `${env.BACKEND_URL}/sections/parse-pdf`;
  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });
  return (await res.json()) as ParsedPdf;
}

function toBlob<T>(data: T): Blob {
  const json = JSON.stringify(data);
  return new Blob([json], { type: "application/json" });
}

/**
 * gets the official upload data from the given formData
 * @param formData
 * @returns
 */
function getOfficialUploadData(
  formData: FormData,
): OfficialUploadData | undefined {
  const officialUploadDataEntry = formData.get("official");
  if (officialUploadDataEntry) {
    const parsedDataEntry = OfficialUploadData.safeParse(
      officialUploadDataEntry,
    );
    if (parsedDataEntry.success) {
      return parsedDataEntry.data;
    }
  }
}
