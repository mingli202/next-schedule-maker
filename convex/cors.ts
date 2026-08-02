import { env } from "./_generated/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": env.CLIENT_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
} as const;
