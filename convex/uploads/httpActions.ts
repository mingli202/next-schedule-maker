import { env, httpAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { ParsedPdf } from "../types.generated";

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

  let parsedPdf: ParsedPdf;
  if (upload) {
    parsedPdf = {
      hash: upload.hash,
      sectionsById: upload.sectionsById,
      semester: upload.semester,
    } satisfies ParsedPdf;
  } else {
    const url = `${env.BACKEND_URL}/sections/parse-pdf`;
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });
    parsedPdf = await res.json();
  }

  return Response.json(parsedPdf, { status: 200 });
});
