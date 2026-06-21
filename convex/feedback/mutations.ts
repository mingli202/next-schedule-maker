import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const submitFeedback = mutation({
  args: {
    feedback: v.string(),
    contactInfo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const feedback = args.feedback.trim();
    const contactInfo = args.contactInfo;

    if (!feedback) {
      throw new Error("Feedback is required.");
    }

    return await ctx.db.insert("feedback", {
      feedback,
      contactInfo,
    });
  },
});
