import { v } from "convex/values";
import { internalQuery, query } from "../_generated/server";
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
 * does the given hash exists, returning the upload if it does
 * */
export const getUploadFromHash = internalQuery({
  args: { hash: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("uploads")
      .withIndex("by_hash", (q) => q.eq("hash", args.hash))
      .first();
  },
});
