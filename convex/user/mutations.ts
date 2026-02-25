import { mutation } from "../_generated/server";
import { getUserIdFromFirebaseId } from "./helpers";

export const createUserIfNotExist = mutation({
  handler: async (ctx) => {
    const { user, firebaseId } = await getUserIdFromFirebaseId(ctx);

    if (!user) {
      ctx.db.insert("users", { firebaseId, collectionPolicy: "on" });
    }
  },
});
