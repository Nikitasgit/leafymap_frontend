import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./i18nConfig";
import { getCurrentUser } from "./lib/api/users";

export async function middleware(request: NextRequest) {
  const i18nResponse = i18nRouter(request, i18nConfig);
  const pathname = request.nextUrl.pathname;
  if (pathname.includes("/account") || pathname.includes("/messages")) {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const user = await getCurrentUser(cookieHeader);
      if (!user) {
        const redirectUrl = new URL("/auth/signin", request.url);
        return NextResponse.redirect(redirectUrl);
      }
      if (pathname.includes("/account/create")) {
        if (user.userType !== "guest") {
          const redirectUrl = new URL("/account", request.url);
          return NextResponse.redirect(redirectUrl);
        }
      }
      if (pathname.includes("/account/places")) {
        if (user.userType !== "organizer" && user.userType !== "creator") {
          const redirectUrl = new URL("/account", request.url);
          return NextResponse.redirect(redirectUrl);
        }
      }
      if (pathname.includes("/account/update-creator")) {
        if (user.userType !== "creator") {
          const redirectUrl = new URL("/account", request.url);
          return NextResponse.redirect(redirectUrl);
        }
      }
      if (pathname.includes("/account/places/create")) {
        if (user.userType !== "organizer") {
          const redirectUrl = new URL("/account", request.url);
          return NextResponse.redirect(redirectUrl);
        }
      }
    }
  }
  return i18nResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
