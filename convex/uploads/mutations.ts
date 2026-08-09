import { v } from "convex/values";
import { internalMutation, mutation, MutationCtx } from "../_generated/server";
import { getUserIdFromFirebaseId } from "../user/helpers";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { DAY } from "../util";
import schema from "../schema";

/**
 *  makes a new upload, returning the upload object
 * */
export const newUpload = internalMutation({
  args: {
    semester: v.string(),
    storageId: v.id("_storage"),
    displayName: v.string(),
    hash: v.string(),
  },
  handler: async (ctx, args) => {
    const { user } = await getUserIdFromFirebaseId(ctx);
    if (!user) {
      throw new Error("user not found");
    }

    const uploadData = {
      storageId: args.storageId,
      hash: args.hash,
      semester: args.semester,
    } as const;

    const uploadId = await ctx.db.insert("uploads", uploadData);

    return {
      ...uploadData,
      uploadId,
    } as const;
  },
});

/**
 *  make a new user upload
 * */
export const newUserUpload = internalMutation({
  args: {
    uploadId: v.id("uploads"),
    deleteScheduleId: v.optional(v.id("_scheduled_functions")),
    displayName: v.string(),
    officialUpload: v.optional(
      v.object({
        comments: v.array(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { user } = await getUserIdFromFirebaseId(ctx);
    if (!user) {
      throw new Error("user not found");
    }

    if (args.officialUpload && user.role === "admin") {
      await ctx.db.insert("officialUploads", {
        uploadId: args.uploadId,
        comments: args.officialUpload.comments,
      });
    } else {
      await ctx.db.insert("userUploads", {
        userId: user._id,
        uploadId: args.uploadId,
        displayName: args.displayName,
      });
    }
  },
});

/**
 * Delete the user upload with the given userUploadId
 * SIDE EFFECT: schedule a deletion of the upload after 24h,
 *              will get canceled if there is a new upload with the same hash
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

/**
 * does the given hash exists, returning the upload if it does
 * also cancelling the delete scheduled function
 * */
export const getUploadFromHash = internalMutation({
  args: { hash: v.string() },
  handler: async (ctx, args) => {
    const upload = await ctx.db
      .query("uploads")
      .withIndex("by_hash", (q) => q.eq("hash", args.hash))
      .first();

    if (!upload) {
      return;
    }

    const deleteScheduleId = upload.deleteScheduleId;
    if (deleteScheduleId) {
      await Promise.all([
        ctx.scheduler.cancel(deleteScheduleId),
        ctx.db.patch("uploads", upload._id, {
          deleteScheduleId: undefined,
        }),
      ]);
    }

    return upload;
  },
});
