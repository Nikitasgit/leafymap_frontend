import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./i18nConfig";
import { verifyTokenServer } from "./utils/tokenVerification";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const detectedLocale = i18nConfig.locales.find((locale) =>
    pathname.startsWith(`/${locale}/`)
  );
  const pathNameWithoutLocale = detectedLocale
    ? pathname.replace(`/${detectedLocale}`, "")
    : pathname;

  const protectedRoutes = ["/account", "/messages"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathNameWithoutLocale.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      const signinUrl = new URL(`/auth/signin`, request.url);
      return NextResponse.redirect(signinUrl);
    }

    const tokenVerification = await verifyTokenServer(token);

    if (!tokenVerification.isValid) {
      const signinUrl = new URL(`/auth/signin`, request.url);
      return NextResponse.redirect(signinUrl);
    }

    const userType = tokenVerification.user?.user.userType;

    // Guest-only routes
    if (pathNameWithoutLocale === "/account/create" && userType !== "guest") {
      const accountUrl = new URL(`/account`, request.url);
      return NextResponse.redirect(accountUrl);
    }

    // Creator-only routes
    if (
      pathNameWithoutLocale === "/account/update-creator" &&
      userType !== "creator"
    ) {
      const accountUrl = new URL(`/account`, request.url);
      return NextResponse.redirect(accountUrl);
    }

    // Organizer-only routes
    const organizerOnlyRoutes = ["/account/places/create"];

    const isOrganizerOnlyRoute = organizerOnlyRoutes.some((route) =>
      pathNameWithoutLocale.startsWith(route)
    );

    // Special handling for place-specific routes
    const placeIdPattern = /^\/account\/places\/[^\/]+$/;
    const isPlaceSpecificRoute = placeIdPattern.test(pathNameWithoutLocale);

    if (isOrganizerOnlyRoute && userType !== "organizer") {
      const accountUrl = new URL(`/account`, request.url);
      return NextResponse.redirect(accountUrl);
    }

    // Restrict access to specific place pages to organizers only
    if (isPlaceSpecificRoute && userType !== "organizer") {
      const accountUrl = new URL(`/account`, request.url);
      return NextResponse.redirect(accountUrl);
    }
  }

  const i18nResponse = i18nRouter(request, i18nConfig);
  return i18nResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
