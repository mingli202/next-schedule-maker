import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getUserIdFromFirebaseId } from "../user/helpers";

/**
 *  make a new upload
 * */
export const newUpload = mutation({
  args: {
    semester: v.string(),
    filename: v.string(),
    sectionsByid: v.string(),
  },
  handler: async (ctx, args) => {
    const { user } = await getUserIdFromFirebaseId(ctx);
    if (!user) {
      throw new Error("user not found");
    }

    const uploadId = await ctx.db.insert("uploads", {
      semester: args.semester,
      filename: args.filename,
      sectionsById: args.sectionsByid,
    });

    await ctx.db.insert("userUploads", {
      userId: user._id,
      uploadId: uploadId,
    });

    return uploadId;
  },
});
