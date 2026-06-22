import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import { CollectionPolicy } from "../types";
import { getUserIdFromFirebaseId } from "./helpers";
import { withoutUndefined } from "../util";
import { deleteAllSchedules } from "../schedules/helpers";

export const createUser = mutation({
  handler: async (ctx): Promise<Id<"users">> => {
    const { user, firebaseId } = await getUserIdFromFirebaseId(ctx);

    if (!user) {
      return ctx.db.insert("users", {
        firebaseId,
        collectionPolicy: "on",
        schedulesVersion: 0,
      });
    }
    return user._id;
  },
});

export const updateUser = mutation({
  args: { collectionPolicy: v.optional(CollectionPolicy) },
  handler: async (ctx, args) => {
    const { user } = await getUserIdFromFirebaseId(ctx);

    if (!user) return;

    return await ctx.db.patch("users", user._id, withoutUndefined(args));
  },
});

export const deleteUser = mutation({
  handler: async (ctx) => {
    const { user } = await getUserIdFromFirebaseId(ctx);

    if (!user) return;

    const userId = user._id;

    await deleteAllSchedules(ctx, userId);

    await ctx.db.delete(user._id);
  },
});
