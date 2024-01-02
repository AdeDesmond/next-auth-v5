/**
 * An Array of routes that are accessible to the public
 * These routes do not required authentication
 * @type {string[]}
 */

export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * An Array of routes that are use for authentication
 * These routes routes will redirect users to /settings
 * @type {string[]}
 */

export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The prefix for Api authentication routes
 * routes that start with this prefix are use for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect route after login in
 *
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/settings";
