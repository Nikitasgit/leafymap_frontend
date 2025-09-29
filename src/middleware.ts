import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./i18nConfig";
import { getCurrentUser } from "./lib/api/users";

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Debug logging en production
    console.log(`[MIDDLEWARE] Processing: ${pathname}`);

    // Vérifier si c'est une route protégée
    const isProtectedRoute =
      pathname.includes("/account") || pathname.includes("/messages");

    if (isProtectedRoute) {
      console.log(`[MIDDLEWARE] Protected route detected: ${pathname}`);

      const cookieHeader = request.headers.get("cookie");
      console.log(`[MIDDLEWARE] Cookie header exists: ${!!cookieHeader}`);

      if (cookieHeader) {
        try {
          const user = await getCurrentUser(cookieHeader);
          console.log(
            `[MIDDLEWARE] User data:`,
            user ? { userType: user.userType, id: user._id } : "null"
          );

          if (!user) {
            console.log(`[MIDDLEWARE] No user found, redirecting to signin`);
            const redirectUrl = new URL("/auth/signin", request.url);
            return NextResponse.redirect(redirectUrl);
          }

          // Logique de redirection basée sur le type d'utilisateur
          if (pathname.includes("/account/create")) {
            if (user.userType !== "guest") {
              console.log(
                `[MIDDLEWARE] User ${user.userType} accessing create, redirecting to account`
              );
              const redirectUrl = new URL("/account", request.url);
              return NextResponse.redirect(redirectUrl);
            }
          }

          if (pathname.includes("/account/places")) {
            if (user.userType !== "organizer" && user.userType !== "creator") {
              console.log(
                `[MIDDLEWARE] User ${user.userType} accessing places, redirecting to account`
              );
              const redirectUrl = new URL("/account", request.url);
              return NextResponse.redirect(redirectUrl);
            }
          }

          if (pathname.includes("/account/update-creator")) {
            if (user.userType !== "creator") {
              console.log(
                `[MIDDLEWARE] User ${user.userType} accessing update-creator, redirecting to account`
              );
              const redirectUrl = new URL("/account", request.url);
              return NextResponse.redirect(redirectUrl);
            }
          }

          if (pathname.includes("/account/places/create")) {
            if (user.userType !== "organizer") {
              console.log(
                `[MIDDLEWARE] User ${user.userType} accessing places/create, redirecting to account`
              );
              const redirectUrl = new URL("/account", request.url);
              return NextResponse.redirect(redirectUrl);
            }
          }
        } catch (error) {
          console.error(`[MIDDLEWARE] Error fetching user:`, error);
          // En cas d'erreur, rediriger vers signin
          const redirectUrl = new URL("/auth/signin", request.url);
          return NextResponse.redirect(redirectUrl);
        }
      } else {
        console.log(`[MIDDLEWARE] No cookies found, redirecting to signin`);
        const redirectUrl = new URL("/auth/signin", request.url);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Gérer l'internationalisation pour toutes les routes
    const i18nResponse = i18nRouter(request, i18nConfig);
    return i18nResponse;
  } catch (error) {
    console.error(`[MIDDLEWARE] Unexpected error:`, error);
    // En cas d'erreur, continuer avec l'internationalisation
    return i18nRouter(request, i18nConfig);
  }
}

export const config = {
  matcher: [
    // Matcher plus spécifique pour les routes protégées
    "/account/:path*",
    "/messages/:path*",
    // Matcher pour l'internationalisation
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
};
