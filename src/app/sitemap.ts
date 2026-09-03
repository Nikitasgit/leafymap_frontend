import { MetadataRoute } from "next";
import { i18nConfig } from "@/i18nConfig";
import { localizedUrl } from "@/shared/utils/i18n/getLocalizedPath";

const PUBLIC_PAGES: {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/map", changeFrequency: "daily", priority: 0.9 },
  { path: "/legal/cgu", changeFrequency: "monthly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return i18nConfig.locales.flatMap((locale) =>
    PUBLIC_PAGES.map((page) => ({
      url: localizedUrl(locale, page.path),
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  );
}
