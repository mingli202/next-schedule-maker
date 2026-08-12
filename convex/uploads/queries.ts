import { query, QueryCtx } from "../_generated/server";
import { getUserIdFromFirebaseId } from "../user/helpers";
import { OfficialUploadData, UploadData, UserUploadData } from "../types";
import { Id } from "../_generated/dataModel";

/**
 * Gets the metadata for the uploads of the user
 * */
export const getUserUploads = query({
  handler: async (ctx): Promise<UserUploadData[]> => {
    const { user } = await getUserIdFromFirebaseId(ctx);
    if (!user) return [];
    const userUploads = await ctx.db
      .query("userUploads")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    return Promise.all(
      userUploads.map(async (u) => {
        return {
          ...(await getUploadData(ctx, u)),
          userUploadId: u._id,
          userUploadTime: u._creationTime,
        } satisfies UserUploadData;
      }),
    );
  },
});

/**
 * the latest official upload data
 */
export const getLatestOfficialUploadData = query({
  handler: async (ctx) => {
    const latest = await ctx.db.query("officialUploads").order("desc").first();
    if (!latest) {
      return;
    }

    return {
      ...(await getUploadData(ctx, latest)),
      officialUploadId: latest._id,
      officialUploadTime: latest._creationTime,
    } satisfies OfficialUploadData;
  },
});

/**
 * Helper function to return an upload data from the given userOrOfficialUpload
 *
 * @param ctx
 * @param userOrOfficialUpload
 * @returns
 */
async function getUploadData(
  ctx: QueryCtx,
  userOrOfficialUpload: { uploadId: Id<"uploads">; displayName: string },
): Promise<UploadData> {
  const upload = await ctx.db.get("uploads", userOrOfficialUpload.uploadId);

  if (!upload) {
    throw new Error("user upload contains non existing upload id");
  }

  const storageUrl = await ctx.storage.getUrl(upload.storageId);

  if (!storageUrl) {
    throw new Error("upload contains a non existing storage id");
  }

  return {
    displayName: userOrOfficialUpload.displayName,
    semester: upload.semester,
    storageUrl,
  } satisfies UploadData;
}
