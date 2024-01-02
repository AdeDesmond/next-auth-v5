import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import * as routes from "@/routes";

const { auth } = NextAuth(authConfig);
export default auth((req) => {
  // req.auth
  //console.log("ROUTE:", req.nextUrl.pathname);
  const { nextUrl } = req;
  const isLoggedin = !!req.auth; // the !! stands for a boolean check
  const isApiAuthRoute = nextUrl.pathname.startsWith(routes.apiAuthPrefix);
  const isPublicRoute = routes.publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = routes.authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedin) {
      return Response.redirect(new URL(routes.DEFAULT_LOGIN_REDIRECT, nextUrl)); //we need to pass nextUrl as the second argument, here so that we can create an absolute url such as http://localhost:3000
    }
    return null;
  }

  if (!isLoggedin && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallBackUrl = encodeURIComponent(callbackUrl); //to make sure we can go to the page that we were trying to access after login, the flow is to from here to the loginForm where we have the searchparams(callbackUrl) and we also send that to the backend login.ts where we  handle the redirect to the callbackUrl or the default url
    return Response.redirect(
      new URL(`/auth/login?callbackUrl${encodedCallBackUrl}`, nextUrl)
    );
  }
  return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"], //this matcher is from clerk docs, AuthMiddleware. so check in the future
};
