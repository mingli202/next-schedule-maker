import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";

export async function deleteAllSchedules(
  ctx: MutationCtx,
  userId: Id<"users">,
) {
  const schedules = await ctx.db
    .query("schedules")
    .withIndex("by_userId_source", (q) => q.eq("userId", userId))
    .collect();

  return await Promise.all(
    schedules.map((schedule) => ctx.db.delete(schedule._id)),
  );
}
