import type { NextRequest } from "next/server";
import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./i18nConfig";

export async function middleware(request: NextRequest) {
  const i18nResponse = i18nRouter(request, i18nConfig);
  return i18nResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
