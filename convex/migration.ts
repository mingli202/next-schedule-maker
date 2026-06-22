import { internalMutation } from "./_generated/server";

export const migrateSectionsToString = internalMutation({
  handler: async (ctx) => {
    const schedules = ctx.db.query("schedules");

    for await (const schedule of schedules) {
      const id = schedule._id;
      const sections = await ctx.db
        .query("sections")
        .withIndex("by_scheduleId", (q) => q.eq("scheduleId", id))
        .collect();

      const orignalSections = sections.map((s) => ({
        sectionId: s.sectionId,
        colorIndex: s.colorIndex,
      }));

      await ctx.db.patch("schedules", id, {
        sections: orignalSections,
      });
    }
  },
});
