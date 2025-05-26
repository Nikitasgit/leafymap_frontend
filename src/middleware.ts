import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userType = payload.userType as string;

    const path = request.nextUrl.pathname;
    if (path === "/places/create" && userType !== "organizer") {
      return NextResponse.redirect(new URL("/account", request.url));
    }

    if (path === "/modifyCreator" && userType !== "creator") {
      return NextResponse.redirect(new URL("/account", request.url));
    }

    if (path === "/createProfile" && userType !== "guest") {
      return NextResponse.redirect(new URL("/account", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
}

export const config = {
  matcher: [
    "/places/create",
    "/modifyCreator",
    "/createProfile",
    "/account",
    "/messages",
    "/messages/:path*",
  ],
};
