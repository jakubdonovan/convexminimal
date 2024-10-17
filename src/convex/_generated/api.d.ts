/* prettier-ignore-start */

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
import type * as helpers from "../helpers.js";
import type * as getProperties from "../getProperties.js";
import type * as getPropertyBySlug from "../getPropertyBySlug.js";
import type * as bookings from "../bookings.js";
import type * as addPropertyAssets from "../addPropertyAssets.js";
import type * as addCompleteProperty from "../addCompleteProperty.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  helpers: typeof helpers;
  getProperties: typeof getProperties;
  getPropertyBySlug: typeof getPropertyBySlug;
  bookings: typeof bookings;
  addPropertyAssets: typeof addPropertyAssets;
  addCompleteProperty: typeof addCompleteProperty;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
