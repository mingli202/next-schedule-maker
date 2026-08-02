import { v } from "convex/values";
import { internalMutation, mutation } from "../_generated/server";
import { getUserIdFromFirebaseId } from "../user/helpers";
import { ParsedPdf } from "../types.generated";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { NewUpload } from "../types";

/**
 *  make a new upload, returning the user upload id
 * */
export const newUpload = internalMutation({
  args: {
    parsedPdf: ParsedPdf,
    storageId: v.id("_storage"),
    displayName: v.string(),
  },
  handler: async (ctx, args): Promise<NewUpload> => {
    const { user } = await getUserIdFromFirebaseId(ctx);
    if (!user) {
      throw new Error("user not found");
    }

    const parsedPdf = args.parsedPdf;

    const uploadId = await ctx.db.insert("uploads", {
      storageId: args.storageId,
      hash: parsedPdf.hash,
      semester: parsedPdf.semester,
    });

    const displayName = args.displayName;
    const userUploadId: Id<"userUploads"> = await ctx.runMutation(
      internal.uploads.mutations.newUserUpload,
      {
        uploadId: uploadId,
        displayName,
      },
    );

    return {
      userUploadId,
      displayName,
      uploadId,
    };
  },
});

/**
 *  make a new user upload, returning the parsed pdf
 * */
export const newUserUpload = internalMutation({
  args: {
    uploadId: v.id("uploads"),
    displayName: v.string(),
  },
  handler: async (ctx, args) => {
    const { user } = await getUserIdFromFirebaseId(ctx);
    if (!user) {
      throw new Error("user not found");
    }

    const userUploadId = await ctx.db.insert("userUploads", {
      userId: user._id,
      uploadId: args.uploadId,
      displayName: args.displayName,
    });

    return userUploadId;
  },
});

export const deleteUpload = mutation({
  args: {
    uploadId: v.id("uploads"),
  },
  handler: async (ctx, args) => {
    const { user } = await getUserIdFromFirebaseId(ctx);
    if (!user) {
      throw new Error("user not found");
    }

    await ctx.db.delete("uploads", args.uploadId);
  },
});
