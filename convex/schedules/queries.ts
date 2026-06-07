import { query } from "../_generated/server";
import { getUserIdFromFirebaseId } from "../user/helpers";
import { SavedSchedule } from "../types";

export const getSchedules = query({
  handler: async (ctx): Promise<SavedSchedule[] | undefined> => {
    const { user } = await getUserIdFromFirebaseId(ctx);

    if (!user) return;

    const schedules = await ctx.db
      .query("schedules")
      .withIndex("by_userId_source", (q) => q.eq("userId", user._id))
      .collect();

    return await Promise.all(
      schedules.map(async (schedule) => {
        const sections = await ctx.db
          .query("sections")
          .withIndex("by_scheduleId", (q) => q.eq("scheduleId", schedule._id))
          .collect();

        return {
          id: schedule._id,
          creationTime: schedule._creationTime,
          name: schedule.name,
          source: schedule.source,
          sections: sections.map(({ sectionId, colorIndex }) => ({
            sectionId,
            colorIndex,
          })),
        } satisfies SavedSchedule;
      }),
    );
  },
});
