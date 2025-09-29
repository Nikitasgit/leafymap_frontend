import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./i18nConfig";
import { verifyJWT, getTokenFromCookies } from "./lib/api/users";

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const isProtectedRoute =
      pathname.includes("/account") || pathname.includes("/messages");

    if (isProtectedRoute) {
      const cookieHeader = request.headers.get("cookie");
      if (!cookieHeader) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }

      const token = getTokenFromCookies(cookieHeader);
      const decodedToken = token ? await verifyJWT(token) : null;

      if (!decodedToken) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }

      const user = {
        userType: decodedToken.userType,
        _id: decodedToken.id,
      };

      // 🔒 Règles d'accès
      if (pathname.includes("/account/create") && user.userType !== "guest") {
        return NextResponse.redirect(new URL("/account", request.url));
      }

      if (
        pathname.includes("/account/places") &&
        !["organizer", "creator"].includes(user.userType)
      ) {
        return NextResponse.redirect(new URL("/account", request.url));
      }

      if (
        pathname.includes("/account/update-creator") &&
        user.userType !== "creator"
      ) {
        return NextResponse.redirect(new URL("/account", request.url));
      }

      if (
        pathname.includes("/account/places/create") &&
        user.userType !== "organizer"
      ) {
        return NextResponse.redirect(new URL("/account", request.url));
      }
    }

    return i18nRouter(request, i18nConfig);
  } catch {
    return i18nRouter(request, i18nConfig);
  }
}

export const config = {
  matcher: [
    "/account/:path*",
    "/messages/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
};
