import { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import { getUserIdFromFirebaseId } from "./helpers";

export const createUser = mutation({
  handler: async (ctx): Promise<Id<"users">> => {
    const { user, firebaseId } = await getUserIdFromFirebaseId(ctx);

    if (!user) {
      return ctx.db.insert("users", {
        firebaseId,
        collectionPolicy: "on",
      });
    }
    return user._id;
  },
});
