import { v } from "convex/values";
import { internalMutation, mutation, MutationCtx } from "../_generated/server";
import { getUserIdFromFirebaseId } from "../user/helpers";
import { ParsedPdf } from "../types.generated";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { NewUpload } from "../types";
import { DAY } from "../util";
import schema from "../schema";

/**
 *  make a new upload, returning the user upload id
 * */
export const newUpload = internalMutation({
  args: {
    parsedPdfStr: v.string(),
    storageId: v.id("_storage"),
    displayName: v.string(),
    hash: v.string(),
  },
  handler: async (ctx, args): Promise<NewUpload> => {
    const { user } = await getUserIdFromFirebaseId(ctx);
    if (!user) {
      throw new Error("user not found");
    }

    const parsedPdf: ParsedPdf = JSON.parse(args.parsedPdfStr);

    const uploadId = await ctx.db.insert("uploads", {
      storageId: args.storageId,
      hash: args.hash,
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

    deleteScheduleId: v.optional(v.id("_scheduled_functions")),
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

    const deleteScheduleId = args.deleteScheduleId;
    if (deleteScheduleId) {
      await Promise.all([
        ctx.scheduler.cancel(deleteScheduleId),
        ctx.db.patch("uploads", args.uploadId, { deleteScheduleId: undefined }),
      ]);
    }

    return userUploadId;
  },
});

/**
 * Delete the user upload with the given userUploadId
 * SIDE EFFECT: schedule a deletion of the upload after 24h,
 *              will get canceled if a new userUpload refers to the upload being deleted
 */
export const deleteUserUpload = mutation({
  args: {
    userUploadId: v.id("userUploads"),
  },
  handler: async (ctx, args) => {
    const { user } = await getUserIdFromFirebaseId(ctx);
    if (!user) {
      throw new Error("user not found");
    }

    const userUpload = await ctx.db.get("userUploads", args.userUploadId);

    if (!userUpload) {
      return;
    }

    await Promise.all([
      ctx.db.delete("userUploads", userUpload._id),
      scheduleDeleteUpload(ctx, userUpload.uploadId),
    ]);
  },
});

/**
 * Schedules a schedule deletion in the future
 *
 * @param ctx
 * @param uploadId
 * @returns
 */
async function scheduleDeleteUpload(ctx: MutationCtx, uploadId: Id<"uploads">) {
  const upload = await ctx.db.get("uploads", uploadId);

  if (!upload) {
    return;
  }

  if (upload.deleteScheduleId) {
    return;
  }

  const deleteScheduleId = await ctx.scheduler.runAfter(
    DAY,
    internal.uploads.mutations.deleteUpload,
    { upload },
  );

  await ctx.db.patch("uploads", uploadId, {
    deleteScheduleId,
  });
}

/**
 * Delete the upload of the given uploadId
 */
export const deleteUpload = internalMutation({
  args: {
    upload: schema.tables.uploads.validator.extend({
      _id: v.id("uploads"),
      _creationTime: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const { upload } = args;

    const [aUserUpload, anOfficialUpload] = await Promise.all([
      ctx.db
        .query("userUploads")
        .withIndex("by_uploadId", (q) => q.eq("uploadId", upload._id))
        .first(),
      ctx.db
        .query("officialUploads")
        .withIndex("by_uploadId", (q) => q.eq("uploadId", upload._id))
        .first(),
    ]);

    if (aUserUpload || anOfficialUpload) {
      return;
    }

    await Promise.all([
      ctx.db.delete("uploads", upload._id),
      ctx.storage.delete(upload.storageId),
    ]);
  },
});
