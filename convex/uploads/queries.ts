import { v } from "convex/values";
import { internalQuery, query } from "../_generated/server";
import { getUserIdFromFirebaseId } from "../user/helpers";

/**
 * Gets the upload of the given uploadId, returning
 * */
export const getUpload = query({
  args: { uploadId: v.id("uploads") },
  handler: async (ctx, args) => {
    getUserIdFromFirebaseId(ctx);

    const upload = await ctx.db.get("uploads", args.uploadId);
    if (!upload) {
      throw new Error(`could not find upload with id ${args.uploadId}`);
    }

    return upload;
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
      .withIndex("by_userId_uploadId", (q) => q.eq("userId", user._id))
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
