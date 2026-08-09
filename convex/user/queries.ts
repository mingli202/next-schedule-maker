import { query } from "../_generated/server";
import { getUserIdFromFirebaseId } from "./helpers";

/**
 * Gets the role of the current user
 */
export const getUserRole = query({
  handler: async (ctx) => {
    const { user } = await getUserIdFromFirebaseId(ctx);
    return user?.role;
  },
});
