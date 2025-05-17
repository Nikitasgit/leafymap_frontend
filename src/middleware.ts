import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add the access token to the request headers for API routes
    if (req.nextUrl.pathname.startsWith("/api/")) {
      const token = req.nextauth.token?.accessToken;
      if (token) {
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("Authorization", `Bearer ${token}`);
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Protect these routes
export const config = {
  matcher: [
    "/account/:path*",
    "/api/:path*",
    "/createProfile/:path*",
    "/dashboard/:path*",
  ],
};
