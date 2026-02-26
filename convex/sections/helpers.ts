import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";

export async function saveSection(
  ctx: MutationCtx,
  userId: Id<"users">,
  section: {
    scheduleId: Id<"schedules">;
    sectionId: number;
    colorIndex: number;
  },
): Promise<Id<"sections">> {
  return await ctx.db.insert("sections", {
    ...section,
    userId,
  });
}

export async function deleteAllSectionsOfUser(
  ctx: MutationCtx,
  userId: Id<"users">,
) {
  const sections = await ctx.db
    .query("sections")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .collect();

  return await Promise.all(
    sections.map((section) => ctx.db.delete(section._id)),
  );
}

export async function deleteAllSectionsOfSchedule(
  ctx: MutationCtx,
  scheduleId: Id<"schedules">,
) {
  const sections = await ctx.db
    .query("sections")
    .withIndex("by_scheduleId", (q) => q.eq("scheduleId", scheduleId))
    .collect();

  return await Promise.all(
    sections.map((section) => ctx.db.delete(section._id)),
  );
}
