import { MutationCtx, QueryCtx } from "../_generated/server";

export async function getUserIdFromFirebaseId(ctx: MutationCtx | QueryCtx) {
  const iden = await ctx.auth.getUserIdentity();
  if (!iden) throw new Error("Unauthenticated");

  const firebaseId = iden.subject;

  return {
    user: await ctx.db
      .query("users")
      .withIndex("by_firebaseId", (q) => q.eq("firebaseId", firebaseId))
      .unique(),
    firebaseId,
  } as const;
}
