import { v } from "convex/values";

export const CollectionPolicy = v.union(
  v.literal("off"),
  v.literal("on"),
  v.literal("anonymous"),
);
export type CollectionPolicy = typeof CollectionPolicy.type;
