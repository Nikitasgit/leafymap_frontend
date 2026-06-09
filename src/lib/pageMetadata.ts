import { Metadata } from "next";
import initTranslations from "@/app/i18n";
import { APP_NAME } from "@/utils/constants";
import { i18nConfig } from "@/i18nConfig";

const MARKETING_NS = "marketing";

type PageMetaKey = keyof typeof PAGE_META_KEYS;

const PAGE_META_KEYS = {
  signin: "pages.signin",
  register: "pages.register",
  forgotPassword: "pages.forgotPassword",
  resetPassword: "pages.resetPassword",
  verifyEmail: "pages.verifyEmail",
  acceptCgu: "pages.acceptCgu",
  resendVerification: "pages.resendVerification",
  checkEmail: "pages.checkEmail",
  account: "pages.account",
  accountCreate: "pages.accountCreate",
  accountSettings: "pages.accountSettings",
  accountUpdateCreator: "pages.accountUpdateCreator",
  accountPlaceCreate: "pages.accountPlaceCreate",
  accountPlaceUpdate: "pages.accountPlaceUpdate",
  accountEventCreate: "pages.accountEventCreate",
  accountEventUpdate: "pages.accountEventUpdate",
  inbox: "pages.inbox",
  cgu: "pages.cgu",
} as const;

function resolveLocale(locale?: string): string {
  if (locale && i18nConfig.locales.includes(locale)) {
    return locale;
  }
  return i18nConfig.defaultLocale;
}

async function getMarketingT(locale?: string) {
  const resolvedLocale = resolveLocale(locale);
  const { t } = await initTranslations(resolvedLocale, [MARKETING_NS]);
  return { t, locale: resolvedLocale };
}

function withAppName(value: string): string {
  return value.replace(/\{\{appName\}\}/g, APP_NAME);
}

function buildMetadata(
  title: string,
  description: string,
  locale: string
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: APP_NAME,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export async function getDefaultMetadata(locale?: string): Promise<Metadata> {
  const { t, locale: resolvedLocale } = await getMarketingT(locale);
  const description = withAppName(t("meta.defaultDescription"));

  return {
    title: APP_NAME,
    description,
    openGraph: {
      title: APP_NAME,
      description,
      siteName: APP_NAME,
      locale: resolvedLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: APP_NAME,
      description,
    },
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      other: [
        {
          url: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  };
}

export async function getHomeMetadata(locale?: string): Promise<Metadata> {
  const { t, locale: resolvedLocale } = await getMarketingT(locale);
  const title = withAppName(t("meta.homeTitle"));
  const description = withAppName(t("meta.homeDescription"));
  return buildMetadata(title, description, resolvedLocale);
}

export async function getMapMetadata(locale?: string): Promise<Metadata> {
  const { t, locale: resolvedLocale } = await getMarketingT(locale);
  const title = withAppName(t("meta.mapTitle"));
  const description = withAppName(t("meta.mapDescription"));
  return buildMetadata(title, description, resolvedLocale);
}

export async function getPageMetadata(
  pageKey: PageMetaKey,
  locale?: string
): Promise<Metadata> {
  const { t, locale: resolvedLocale } = await getMarketingT(locale);
  const baseKey = PAGE_META_KEYS[pageKey];
  const title = withAppName(t(`${baseKey}.title`));
  const description = withAppName(t(`${baseKey}.description`));
  return buildMetadata(title, description, resolvedLocale);
}

export async function getManifestStrings(locale?: string) {
  const { t } = await getMarketingT(locale);
  return {
    name: withAppName(t("meta.manifestName")),
    short_name: t("meta.manifestShortName"),
  };
}
