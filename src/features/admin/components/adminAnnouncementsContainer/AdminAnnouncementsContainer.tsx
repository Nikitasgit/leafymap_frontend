"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/ui/pageHeader";
import Button from "@/shared/ui/buttons/button";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import EmptyState from "@/shared/ui/noResults/emptyState";
import {
  archiveAdminAnnouncement,
  deleteAdminAnnouncement,
  listAdminAnnouncements,
  publishAdminAnnouncement,
} from "@/features/announcements";
import type { Announcement } from "@/features/announcements";
import useHandleApiErrors from "@/shared/hooks/useHandleApiErrors";
import styles from "./AdminAnnouncementsContainer.module.scss";

const titleFor = (announcement: Announcement) =>
  announcement.translations.find((t) => t.locale === "fr")?.title ??
  announcement.translations[0]?.title ??
  announcement.slug;

const AdminAnnouncementsContainer = () => {
  const { t } = useTranslation("admin");
  const router = useRouter();
  const { handleApiError } = useHandleApiErrors();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setAnnouncements(await listAdminAnnouncements());
    } catch (err: unknown) {
      setAnnouncements([]);
      handleApiError(err, undefined, true);
    } finally {
      setIsLoading(false);
    }
    // handleApiError is recreated each render; omit it to avoid reload loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onPublish = async (id: string) => {
    try {
      await publishAdminAnnouncement(id);
      await load();
    } catch (err: unknown) {
      handleApiError(err, undefined, true);
    }
  };

  const onArchive = async (id: string) => {
    try {
      await archiveAdminAnnouncement(id);
      await load();
    } catch (err: unknown) {
      handleApiError(err, undefined, true);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteAdminAnnouncement(id);
      await load();
    } catch (err: unknown) {
      handleApiError(err, undefined, true);
    }
  };

  return (
    <main className={styles.container}>
      <PageHeader
        title={t("adminAnnouncements.title")}
        subtitle={t("adminAnnouncements.subtitle")}
      />

      <div className={styles.toolbar}>
        <Link href="/admin/users" className={styles.navLink}>
          {t("adminAnnouncements.toUsers")}
        </Link>
        <Button
          variant="primary"
          onClick={() => router.push("/admin/announcements/new")}
        >
          {t("adminAnnouncements.create")}
        </Button>
      </div>

      {isLoading ? <LoadingBar /> : null}

      {!isLoading && announcements.length === 0 ? (
        <EmptyState title={t("adminAnnouncements.empty")} />
      ) : null}

      <ul className={styles.list}>
        {announcements.map((announcement) => (
          <li key={announcement.id} className={styles.item}>
            <div className={styles.meta}>
              <strong>{titleFor(announcement)}</strong>
              <span className={styles.slug}>{announcement.slug}</span>
              <span className={styles.status}>{announcement.status}</span>
              <span className={styles.priority}>
                {t("adminAnnouncements.priority")}: {announcement.priority}
              </span>
            </div>
            <div className={styles.actions}>
              <Button
                size="small"
                variant="outline"
                onClick={() =>
                  router.push(`/admin/announcements/${announcement.id}`)
                }
              >
                {t("adminAnnouncements.edit")}
              </Button>
              {announcement.status !== "published" ? (
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => void onPublish(announcement.id)}
                >
                  {t("adminAnnouncements.publish")}
                </Button>
              ) : null}
              {announcement.status !== "archived" ? (
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => void onArchive(announcement.id)}
                >
                  {t("adminAnnouncements.archive")}
                </Button>
              ) : null}
              <Button
                size="small"
                variant="danger"
                onClick={() => void onDelete(announcement.id)}
              >
                {t("adminAnnouncements.delete")}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default AdminAnnouncementsContainer;
