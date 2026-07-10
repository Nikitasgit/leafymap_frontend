import type { NextRequest } from "next/server";
import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./i18nConfig";

/**
 * Next.js proxy that handles internationalization routing.
 * Redirects requests to the appropriate locale path (e.g., /en or /fr).
 */
export async function proxy(request: NextRequest) {
  const i18nResponse = i18nRouter(request, i18nConfig);
  return i18nResponse;
}

// Exclude static assets, API routes, and metadata files from i18n routing
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico).*)",
  ],
};
