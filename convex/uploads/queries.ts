import { v } from "convex/values";
import { query } from "../_generated/server";
import { getUserIdFromFirebaseId } from "../user/helpers";

/**
 * Gets the upload of the given uploadId, returning
 * */
export const getUpload = query({
  args: { uploadId: v.id("uploads") },
  handler: async (ctx, args) => {
    getUserIdFromFirebaseId(ctx);

    return ctx.db.get("uploads", args.uploadId);
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
