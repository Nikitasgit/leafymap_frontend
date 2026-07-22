import { capitalizeFirstLetter } from "@/shared/utils/functions";
import { APP_NAME } from "@/shared/config/app";
import { Metadata } from "next";
import { getUserById } from "@/features/users/api/usersApi";
import { getEventById } from "@/features/events/api/eventsApi";
import initTranslations from "@/app/i18n";
import { i18nConfig } from "@/i18nConfig";
import { resolveRefObject } from "@/shared/api/normalizers/resolveRef";

function resolveLocale(locale?: string): string {
  if (locale && i18nConfig.locales.includes(locale)) {
    return locale;
  }
  return i18nConfig.defaultLocale;
}

function withAppName(value: string): string {
  return value.replace(/\{\{appName\}\}/g, APP_NAME);
}

async function getMarketingT(locale?: string) {
  const resolvedLocale = resolveLocale(locale);
  const { t } = await initTranslations(resolvedLocale, ["marketing"]);
  return { t, locale: resolvedLocale };
}

function buildShareMetadata(
  title: string,
  description: string,
  locale: string,
  type: "profile" | "website" = "website"
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: APP_NAME,
      locale,
      type,
    },
    twitter: {
      card: type === "website" ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}

export async function generateUserMetadata(
  userId: string,
  locale?: string
): Promise<Metadata> {
  const { t, locale: resolvedLocale } = await getMarketingT(locale);

  try {
    const userData = await getUserById(userId);
    if (typeof userData === "string" || !userData) {
      const title = withAppName(t("meta.userFallbackTitle"));
      const description = withAppName(t("meta.userFallbackDescription"));
      return buildShareMetadata(title, description, resolvedLocale, "profile");
    }

    const username = capitalizeFirstLetter(userData.username) || "Organisateur";
    const title = withAppName(
      t("meta.userTitle", { username })
    );
    const description = withAppName(
      t("meta.userDescription", {
        username,
        description: userData.description || "",
      })
    );

    return buildShareMetadata(title, description, resolvedLocale, "profile");
  } catch {
    const title = withAppName(t("meta.userFallbackTitle"));
    const description = withAppName(t("meta.userFallbackDescription"));
    return buildShareMetadata(title, description, resolvedLocale, "profile");
  }
}

export async function generateEventMetadata(
  eventId: string,
  locale?: string
): Promise<Metadata> {
  const { t, locale: resolvedLocale } = await getMarketingT(locale);

  try {
    const eventData = await getEventById(eventId);
    if (typeof eventData === "string" || !eventData) {
      const title = withAppName(t("meta.eventFallbackTitle"));
      const description = withAppName(t("meta.eventFallbackDescription"));
      return buildShareMetadata(title, description, resolvedLocale);
    }

    const eventName = capitalizeFirstLetter(eventData.name) || "Événement";
    const eventDescription =
      capitalizeFirstLetter(eventData.description) ||
      withAppName(t("meta.eventDescriptionFallback"));
    const eventPlace = resolveRefObject(eventData.place);
    const placeLabel =
      eventData.online
        ? "en ligne"
        : eventData.location?.label || eventPlace?.location?.label;
    const placeName = placeLabel
      ? withAppName(
          t("meta.eventPlaceSuffix", {
            placeName: capitalizeFirstLetter(placeLabel),
          })
        )
      : "";

    const title = withAppName(t("meta.eventTitle", { eventName }));
    const description = withAppName(
      t("meta.eventDescription", {
        eventName,
        placeName,
        description: eventDescription,
      })
    );

    return buildShareMetadata(title, description, resolvedLocale);
  } catch {
    const title = withAppName(t("meta.eventFallbackTitle"));
    const description = withAppName(t("meta.eventFallbackDescription"));
    return buildShareMetadata(title, description, resolvedLocale);
  }
}
