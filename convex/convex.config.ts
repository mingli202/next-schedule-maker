import { defineApp } from "convex/server";
import { v } from "convex/values";

const app = defineApp({
  env: {
    ENV: v.optional(v.literal("DEV")),
    DEV_FIREBASE_PROJECT_ID: v.string(),
    FIREBASE_PROJECT_ID: v.string(),
  },
});

export default app;
