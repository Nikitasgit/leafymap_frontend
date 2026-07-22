"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { getActiveAnnouncements } from "@/features/announcements/api/announcementsApi";
import type {
  ActiveAnnouncement,
  AnnouncementLocale,
} from "@/features/announcements/types";
import { capitalizeFirstLetter } from "@/shared/utils/functions";

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

  if (!announcement) {
    return null;
  }

  return (
    <Snackbar
      open={!dismissed}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      sx={{ maxWidth: 400, width: { xs: "calc(100% - 32px)", sm: 400 } }}
    >
      <Alert
        severity="success"
        variant="filled"
        onClose={handleDismiss}
        closeText={t("actions.close")}
        sx={{
          width: "100%",
          bgcolor: "primary.main",
          alignItems: "flex-start",
          "& .MuiAlert-message": { width: "100%", py: 0.25 },
        }}
      >
        <AlertTitle sx={{ mb: 0.25, fontSize: "0.9rem", fontWeight: 700 }}>
          {capitalizeFirstLetter(announcement.title)}
        </AlertTitle>
        {capitalizeFirstLetter(announcement.body)}
        {announcement.ctaHref && announcement.ctaLabel ? (
          <Button
            component={Link}
            href={announcement.ctaHref}
            color="inherit"
            size="small"
            sx={{
              display: "block",
              mt: 0.5,
              px: 0,
              minWidth: 0,
              fontWeight: 600,
              textDecoration: "underline",
              textTransform: "none",
            }}
          >
            {capitalizeFirstLetter(announcement.ctaLabel)}
          </Button>
        ) : null}
      </Alert>
    </Snackbar>
  );
};

export default AnnouncementBanner;
