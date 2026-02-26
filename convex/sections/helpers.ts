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
