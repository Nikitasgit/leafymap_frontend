"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { X } from "lucide-react";
import { getActiveAnnouncements } from "@/features/announcements/api/announcementsApi";
import type {
  ActiveAnnouncement,
  AnnouncementLocale,
} from "@/features/announcements/types";
import styles from "./AnnouncementBanner.module.scss";

const STORAGE_PREFIX = "leafymap:dismissed-announcement:";

const AnnouncementBanner = () => {
  const params = useParams();
  const localeParam = params?.locale;
  const locale: AnnouncementLocale =
    localeParam === "en" || localeParam === "fr" ? localeParam : "fr";
  const { t } = useTranslation("common");
  const [announcement, setAnnouncement] = useState<ActiveAnnouncement | null>(
    null,
  );
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const items = await getActiveAnnouncements(locale);
        if (cancelled) return;
        const top = items[0] ?? null;
        if (!top) {
          setAnnouncement(null);
          return;
        }
        const dismissedId =
          typeof window !== "undefined"
            ? sessionStorage.getItem(`${STORAGE_PREFIX}${top.id}`)
            : null;
        if (dismissedId) {
          setDismissed(true);
          setAnnouncement(top);
          return;
        }
        setDismissed(false);
        setAnnouncement(top);
      } catch {
        if (!cancelled) {
          setAnnouncement(null);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const handleDismiss = useCallback(() => {
    if (!announcement) return;
    sessionStorage.setItem(`${STORAGE_PREFIX}${announcement.id}`, "1");
    setDismissed(true);
  }, [announcement]);

  if (!announcement || dismissed) {
    return null;
  }

  return (
    <aside className={styles.banner} role="status" aria-live="polite">
      <div className={styles.content}>
        <strong className={styles.title}>{announcement.title}</strong>
        <p className={styles.body}>{announcement.body}</p>
        {announcement.ctaHref && announcement.ctaLabel ? (
          <Link className={styles.cta} href={announcement.ctaHref}>
            {announcement.ctaLabel}
          </Link>
        ) : null}
      </div>
      <button
        type="button"
        className={styles.dismiss}
        onClick={handleDismiss}
        aria-label={t("actions.close")}
      >
        <X size={16} />
      </button>
    </aside>
  );
};

export default AnnouncementBanner;
