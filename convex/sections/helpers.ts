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

export async function deleteAllSections(ctx: MutationCtx, userId: Id<"users">) {
  const sections = await ctx.db
    .query("sections")
    .withIndex("by_userId_scheduleId", (q) => q.eq("userId", userId))
    .collect();

  return await Promise.all(
    sections.map((section) => ctx.db.delete(section._id)),
  );
}
