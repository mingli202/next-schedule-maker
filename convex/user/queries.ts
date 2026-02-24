import { v } from "convex/values";
import { query } from "../_generated/server";

export const getUserFromFirebaseId = query({
  args: { firebaseId: v.string() },
  handler: async (ctx, args) => {},
});
