import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getUserIdFromFirebaseId } from "../user/helpers";
import { saveSection } from "./helpers";
import { withoutUndefined } from "../util";

export const deleteSection = mutation({
  args: {
    sectionId: v.id("sections"),
  },
  handler: async (ctx, args) => {
    const { user } = await getUserIdFromFirebaseId(ctx);

    if (!user) return;

    const { sectionId } = args;

    const section = await ctx.db.get("sections", sectionId);

    if (!section || section.userId !== user._id) return;

    return await ctx.db.delete("sections", sectionId);
  },
});
