import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./i18nConfig";

export async function middleware(request: NextRequest) {
  // Handle i18n routing first
  const i18nResponse = i18nRouter(request, i18nConfig);
  if (i18nResponse) {
    return i18nResponse;
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userType = payload.userType as string;

    const path = request.nextUrl.pathname;
    if (path === "/places/create-place" && userType !== "organizer") {
      return NextResponse.redirect(new URL("/account", request.url));
    }

    if (path === "/account/update-creator" && userType !== "creator") {
      return NextResponse.redirect(new URL("/account", request.url));
    }
    const isModifyPlacePath = /^\/places\/[^/]+\/modify$/.test(path);
    if (isModifyPlacePath && userType !== "organizer") {
      return NextResponse.redirect(new URL("/account", request.url));
    }
    if (path === "/account/create-profile" && userType !== "guest") {
      return NextResponse.redirect(new URL("/account", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next).*)",
    "/places/create-place",
    "/places/:path*/update-place",
    "/account/update-creator",
    "/account/create-profile",
    "/account",
    "/messages",
    "/messages/:path*",
  ],
};
