import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getUserIdFromFirebaseId } from "../user/helpers";
import { deleteAllSectionsOfSchedule, saveSection } from "../sections/helpers";
import { withoutUndefined } from "../util";

export const createSchedule = mutation({
  args: {
    name: v.string(),
    source: v.string(),
    sections: v.array(
      v.object({
        sectionId: v.number(),
        colorIndex: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { user } = await getUserIdFromFirebaseId(ctx);

    if (!user) return;

    const { name, source, sections } = args;

    const scheduleId = await ctx.db.insert("schedules", {
      name,
      source,
      userId: user._id,
    });

    await Promise.all(
      sections.map((section) =>
        saveSection(ctx, user._id, {
          scheduleId,
          ...section,
        }),
      ),
    );

    return scheduleId;
  },
});

export const updateSchedule = mutation({
  args: {
    scheduleId: v.id("schedules"),
    name: v.optional(v.string()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await getUserIdFromFirebaseId(ctx);

    if (!user) return;

    const { scheduleId, ...update } = args;

    const schedule = await ctx.db.get("schedules", scheduleId);

    if (!schedule || schedule.userId !== user._id) return;

    return ctx.db.patch(scheduleId, withoutUndefined(update));
  },
});

export const deleteSchedule = mutation({
  args: {
    scheduleId: v.id("schedules"),
  },
  handler: async (ctx, args) => {
    const { user } = await getUserIdFromFirebaseId(ctx);

    if (!user) return;

    const { scheduleId } = args;

    const schedule = await ctx.db.get("schedules", scheduleId);

    if (!schedule || schedule.userId !== user._id) return;

    await deleteAllSectionsOfSchedule(ctx, scheduleId);

    return ctx.db.delete("schedules", scheduleId);
  },
});
