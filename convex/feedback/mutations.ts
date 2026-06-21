import { v } from "convex/values";
import type { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";

function normalizeContact(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export const submitFeedback = mutation({
  args: {
    feedback: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const feedback = args.feedback.trim();

    if (!feedback) {
      throw new Error("Feedback is required.");
    }

    const identity = await ctx.auth.getUserIdentity();
    const firebaseId = identity?.subject;

    let userId: Id<"users"> | undefined;

    if (firebaseId) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_firebaseId", (q) => q.eq("firebaseId", firebaseId))
        .unique();
      userId = user?._id;
    }

    return await ctx.db.insert("feedback", {
      feedback,
      email: normalizeContact(args.email),
      phone: normalizeContact(args.phone),
      firebaseId,
      userId,
    });
  },
});
