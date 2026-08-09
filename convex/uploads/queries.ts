import { query } from "../_generated/server";
import { getUserIdFromFirebaseId } from "../user/helpers";
import { UserUploadData } from "../types";

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
        const upload = await ctx.db.get(u.uploadId);

        if (!upload) {
          throw new Error("user upload contains non existing upload id");
        }

        const storageUrl = await ctx.storage.getUrl(upload.storageId);

        if (!storageUrl) {
          throw new Error("upload contains a non existing storage id");
        }

        return {
          displayName: u.displayName,
          userUploadId: u._id,
          semester: upload.semester,
          storageUrl,
          userUploadTime: u._creationTime,
        } satisfies UserUploadData;
      }),
    );
  },
});

/**
 * the latest official upload
 */
export const getLatestVersionId = query({
  handler: async (ctx) => {
    return await ctx.db.query("officialUploads").order("desc").first();
  },
});
