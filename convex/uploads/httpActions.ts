import { env, httpAction } from "../_generated/server";
import { api, internal } from "../_generated/api";
import { ParsedPdf, SectionsDiff } from "../types.generated";
import { NewUpload, OfficialUploadMetaData } from "../types";
import { GenericActionCtx } from "convex/server";
import { corsHeaders } from "../cors";
import { getSectionsDiff } from "../sectionDiff";

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

  let parsedPdf: ParsedPdf | undefined = undefined;
  if (!upload) {
    [upload, parsedPdf] = await newUpload(ctx, formData, file.name, hash);
  }

  const officialUploadData = getOfficialUploadData(formData);
  if (officialUploadData) {
    // if no parsed pdf, it's not a new upload
    if (!parsedPdf) {
      return new Response(null, {
        status: 304, // Not Modified
        headers: { ...corsHeaders },
      });
    }
    await newOfficialUpload(
      ctx,
      upload,
      file.name,
      officialUploadData,
      parsedPdf,
    );
  } else {
    await newUserOrOfficialUpload(ctx, upload, file.name);
  }

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
) {
  await ctx.runMutation(internal.uploads.mutations.newUserUpload, {
    uploadId: upload.uploadId,
    displayName,
  });
}

/**
 * Makes a new official upload, fetches the old official upload to compute diffs
 * @param ctx
 * @param upload
 * @param displayName
 * @param officialUploadMetaData
 */
async function newOfficialUpload(
  ctx: GenericActionCtx<any>,
  upload: NewUpload,
  displayName: string,
  officialUploadMetaData: OfficialUploadMetaData,
  oldParsedPdf: ParsedPdf,
) {
  const latestOfficialUpload = await ctx.runQuery(
    api.uploads.queries.getLatestOfficialUploadData,
  );
  let sectionsDiff: SectionsDiff | undefined = undefined;

  // only compute section diffs for the same semester
  if (
    latestOfficialUpload &&
    latestOfficialUpload.semester === oldParsedPdf.semester
  ) {
    const url = latestOfficialUpload.storageUrl;
    const newSectionsById = await fetchLastOfficialUpload(url);

    if (newSectionsById) {
      sectionsDiff = getSectionsDiff(
        oldParsedPdf.sectionsById,
        newSectionsById,
      );
    }
  }

  await ctx.runMutation(internal.uploads.mutations.newOfficialUpload, {
    uploadId: upload.uploadId,
    displayName: displayName,
    comments: officialUploadMetaData.comments,
    sectionsDiff,
  });
}

/**
 *
 * @returns the sections of the last. May be undefined if no prior data was stored
 */
async function fetchLastOfficialUpload(
  url: string,
): Promise<ParsedPdf["sectionsById"] | undefined> {
  const res = await fetch(url);

  if (!res.ok) {
    return;
  }

  return await res.json();
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

  return [
    await ctx.runMutation(internal.uploads.mutations.newUpload, {
      semester: parsedPdf.semester,
      storageId,
      displayName,
      hash,
    }),
    parsedPdf,
  ] as const;
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

  if (!res.ok) {
    throw new Error("fetch data from storage url error");
  }

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
): OfficialUploadMetaData | undefined {
  const officialUploadDataEntry = formData.get("official");
  if (officialUploadDataEntry) {
    const parsedDataEntry = OfficialUploadMetaData.safeParse(
      officialUploadDataEntry,
    );
    if (parsedDataEntry.success) {
      return parsedDataEntry.data;
    }
  }
}
