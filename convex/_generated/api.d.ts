/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as chat_mutations from "../chat/mutations.js";
import type * as chat_queries from "../chat/queries.js";
import type * as http from "../http.js";
import type * as rooms_mutations from "../rooms/mutations.js";
import type * as rooms_queries from "../rooms/queries.js";
import type * as session_mutations from "../session/mutations.js";
import type * as session_queries from "../session/queries.js";
import type * as tasks_mutations from "../tasks/mutations.js";
import type * as tasks_queries from "../tasks/queries.js";
import type * as time_queries from "../time/queries.js";
import type * as user from "../user.js";
import type * as utils_auth from "../utils/auth.js";
import type * as utils_db from "../utils/db.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "chat/mutations": typeof chat_mutations;
  "chat/queries": typeof chat_queries;
  http: typeof http;
  "rooms/mutations": typeof rooms_mutations;
  "rooms/queries": typeof rooms_queries;
  "session/mutations": typeof session_mutations;
  "session/queries": typeof session_queries;
  "tasks/mutations": typeof tasks_mutations;
  "tasks/queries": typeof tasks_queries;
  "time/queries": typeof time_queries;
  user: typeof user;
  "utils/auth": typeof utils_auth;
  "utils/db": typeof utils_db;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
