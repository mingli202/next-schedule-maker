import { env, httpAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { ParsedPdf } from "../types.generated";
import { Doc, Id } from "../_generated/dataModel";
import { NewUpload } from "../types";
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

  const upload = await ctx.runQuery(
    internal.uploads.queries.getUploadFromHash,
    {
      hash,
    },
  );

  if (upload) {
    return newUserUpload(ctx, upload, file.name);
  }

  return newUpload(ctx, formData, file.name, hash);
});

/**
 * store in db a new user upload with the given existing upload
 * */
async function newUserUpload(
  ctx: GenericActionCtx<any>,
  upload: Doc<"uploads">,
  displayName: string,
) {
  const userUploadId: Id<"userUploads"> = await ctx.runMutation(
    internal.uploads.mutations.newUserUpload,
    {
      uploadId: upload._id,
      displayName,
    },
  );

  const newUpload = {
    displayName,
    userUploadId,
    uploadId: upload._id,
  } satisfies NewUpload;

  return Response.json(
    { newUpload },
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
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
  const url = `${env.BACKEND_URL}/sections/parse-pdf`;
  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });
  const parsedPdf = (await res.json()) as ParsedPdf;

  const sectionsBlob = toBlob(parsedPdf.sectionsById);
  const storageId = await ctx.storage.store(sectionsBlob);

  const newUpload = await ctx.runMutation(
    internal.uploads.mutations.newUpload,
    {
      parsedPdfStr: JSON.stringify(parsedPdf),
      storageId,
      displayName,
      hash,
    },
  );

  return Response.json(
    { newUpload },
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}

function toBlob<T>(data: T): Blob {
  const json = JSON.stringify(data);
  return new Blob([json], { type: "application/json" });
}
