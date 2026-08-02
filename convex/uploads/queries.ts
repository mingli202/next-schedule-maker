import { v } from "convex/values";
import { internalQuery, query } from "../_generated/server";
import { getUserIdFromFirebaseId } from "../user/helpers";
import { UserUploadData } from "../types";

/**
 * Gets the upload of the given uploadId, returning
 * */
export const getUserUpload = query({
  args: { userUploadId: v.id("userUploads") },
  handler: async (ctx, args) => {
    const { user } = await getUserIdFromFirebaseId(ctx);

    if (!user) {
      throw new Error("could not find user");
    }

    const userUpload = await ctx.db.get("userUploads", args.userUploadId);

    if (!userUpload) {
      throw new Error(
        `could not find user upload with id ${args.userUploadId}`,
      );
    }

    const upload = await ctx.db.get("uploads", userUpload.uploadId);
    if (!upload) {
      throw new Error(`could not find upload with id ${userUpload.uploadId}`);
    }

    return {
      sectionsById: upload.sectionsById,
      semester: upload.semester,
      displayName: userUpload.displayName,
      userUploadTime: userUpload._creationTime,
      userUploadId: userUpload._id,
    } satisfies UserUploadData;
  },
});

/**
 * Gets the metadata for the uploads of the user
 * */
export const getUserUploads = query({
  handler: async (ctx) => {
    const { user } = await getUserIdFromFirebaseId(ctx);
    if (!user) return [];
    return ctx.db
      .query("userUploads")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
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
