import type { MetadataRoute } from "next";
import { APP_URL } from "@/shared/config/app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/map", "/places/", "/events/", "/users/", "/legal/"],
      disallow: [
        "/account/",
        "/inbox/",
        "/admin/",
        "/auth/",
        "/api/",
        "/locales/",
        "/images/default-*",
      ],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
