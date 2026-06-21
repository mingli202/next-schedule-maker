/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as feedback_mutations from "../feedback/mutations.js";
import type * as schedules_helpers from "../schedules/helpers.js";
import type * as schedules_mutations from "../schedules/mutations.js";
import type * as schedules_queries from "../schedules/queries.js";
import type * as sections_helpers from "../sections/helpers.js";
import type * as sections_mutations from "../sections/mutations.js";
import type * as types from "../types.js";
import type * as user_helpers from "../user/helpers.js";
import type * as user_mutations from "../user/mutations.js";
import type * as util from "../util.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "feedback/mutations": typeof feedback_mutations;
  "schedules/helpers": typeof schedules_helpers;
  "schedules/mutations": typeof schedules_mutations;
  "schedules/queries": typeof schedules_queries;
  "sections/helpers": typeof sections_helpers;
  "sections/mutations": typeof sections_mutations;
  types: typeof types;
  "user/helpers": typeof user_helpers;
  "user/mutations": typeof user_mutations;
  util: typeof util;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
