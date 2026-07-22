export type AnnouncementLocale = "fr" | "en";
export type AnnouncementStatus = "draft" | "published" | "archived";

export type AnnouncementTranslation = {
  locale: AnnouncementLocale;
  title: string;
  body: string;
  ctaLabel: string | null;
  ctaHref: string | null;
};

export type Announcement = {
  id: string;
  slug: string;
  status: AnnouncementStatus;
  priority: number;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
  translations: AnnouncementTranslation[];
};

export type ActiveAnnouncement = {
  id: string;
  slug: string;
  priority: number;
  locale: AnnouncementLocale;
  title: string;
  body: string;
  ctaLabel: string | null;
  ctaHref: string | null;
};

export type AnnouncementInput = {
  slug: string;
  priority?: number;
  startsAt?: string | null;
  endsAt?: string | null;
  translations: {
    locale: AnnouncementLocale;
    title: string;
    body: string;
    ctaLabel?: string | null;
    ctaHref?: string | null;
  }[];
};
