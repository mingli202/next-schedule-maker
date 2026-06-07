import { query } from "../_generated/server";
import { getUserIdFromFirebaseId } from "../user/helpers";

export const getSchedules = query({
  handler: async (ctx) => {
    const { user } = await getUserIdFromFirebaseId(ctx);

    if (!user) return;

    const schedules = await ctx.db
      .query("schedules")
      .withIndex("by_userId_source", (q) => q.eq("userId", user._id))
      .collect();

    return schedules;
  },
});
