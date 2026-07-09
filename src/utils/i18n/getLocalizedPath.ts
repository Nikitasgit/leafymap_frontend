import { i18nConfig } from "@/i18nConfig";

export function stripLocaleFromPath(
  pathname: string,
  locales = i18nConfig.locales
): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) {
      return "/";
    }
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(`/${locale}`.length);
    }
  }
  return pathname;
}

export function getLocalizedPath(
  pathname: string,
  locale: string,
  config = i18nConfig
): string {
  const { locales, defaultLocale } = config;
  const pathWithoutLocale = stripLocaleFromPath(pathname, locales);

  if (locale === defaultLocale) {
    return pathWithoutLocale;
  }

  if (pathWithoutLocale === "/") {
    return `/${locale}`;
  }

  return `/${locale}${pathWithoutLocale}`;
}

/** Always prefixes the locale so middleware can update the locale cookie. */
export function getLocaleSwitchPath(
  pathname: string,
  locale: string,
  config = i18nConfig
): string {
  const pathWithoutLocale = stripLocaleFromPath(pathname, config.locales);

  if (pathWithoutLocale === "/") {
    return `/${locale}`;
  }

  return `/${locale}${pathWithoutLocale}`;
}
