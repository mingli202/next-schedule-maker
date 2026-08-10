/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as cors from "../cors.js";
import type * as feedback_mutations from "../feedback/mutations.js";
import type * as http from "../http.js";
import type * as schedules_helpers from "../schedules/helpers.js";
import type * as schedules_mutations from "../schedules/mutations.js";
import type * as schedules_queries from "../schedules/queries.js";
import type * as sectionDiff from "../sectionDiff.js";
import type * as types from "../types.js";
import type * as uploads_httpActions from "../uploads/httpActions.js";
import type * as uploads_mutations from "../uploads/mutations.js";
import type * as uploads_queries from "../uploads/queries.js";
import type * as user_helpers from "../user/helpers.js";
import type * as user_mutations from "../user/mutations.js";
import type * as user_queries from "../user/queries.js";
import type * as util from "../util.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  cors: typeof cors;
  "feedback/mutations": typeof feedback_mutations;
  http: typeof http;
  "schedules/helpers": typeof schedules_helpers;
  "schedules/mutations": typeof schedules_mutations;
  "schedules/queries": typeof schedules_queries;
  sectionDiff: typeof sectionDiff;
  types: typeof types;
  "uploads/httpActions": typeof uploads_httpActions;
  "uploads/mutations": typeof uploads_mutations;
  "uploads/queries": typeof uploads_queries;
  "user/helpers": typeof user_helpers;
  "user/mutations": typeof user_mutations;
  "user/queries": typeof user_queries;
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
