import { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { DataModel } from "../_generated/dataModel";

export async function getUserIdFromFirebaseId(
  ctx: GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>,
) {
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
