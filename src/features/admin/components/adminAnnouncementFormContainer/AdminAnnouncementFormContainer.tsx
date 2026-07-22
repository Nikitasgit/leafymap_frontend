"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/ui/pageHeader";
import TextField from "@/shared/ui/inputs/textField";
import Button from "@/shared/ui/buttons/button";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import {
  createAdminAnnouncement,
  getAdminAnnouncement,
  updateAdminAnnouncement,
} from "@/features/announcements";
import type { AnnouncementInput } from "@/features/announcements";
import styles from "./AdminAnnouncementFormContainer.module.scss";

type Props = {
  announcementId?: string;
};

const emptyForm: AnnouncementInput = {
  slug: "",
  priority: 0,
  startsAt: null,
  endsAt: null,
  translations: [
    { locale: "fr", title: "", body: "", ctaLabel: "", ctaHref: "" },
    { locale: "en", title: "", body: "", ctaLabel: "", ctaHref: "" },
  ],
};

const toDatetimeLocal = (iso: string | null | undefined) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const fromDatetimeLocal = (value: string): string | null => {
  if (!value.trim()) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const AdminAnnouncementFormContainer = ({ announcementId }: Props) => {
  const { t } = useTranslation("admin");
  const router = useRouter();
  const isEdit = Boolean(announcementId);
  const [form, setForm] = useState<AnnouncementInput>(emptyForm);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!announcementId) return;
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const announcement = await getAdminAnnouncement(announcementId);
        if (cancelled) return;
        const fr = announcement.translations.find(
          (translation) => translation.locale === "fr",
        );
        const en = announcement.translations.find(
          (translation) => translation.locale === "en",
        );
        setForm({
          slug: announcement.slug,
          priority: announcement.priority,
          startsAt: announcement.startsAt,
          endsAt: announcement.endsAt,
          translations: [
            {
              locale: "fr",
              title: fr?.title ?? "",
              body: fr?.body ?? "",
              ctaLabel: fr?.ctaLabel ?? "",
              ctaHref: fr?.ctaHref ?? "",
            },
            {
              locale: "en",
              title: en?.title ?? "",
              body: en?.body ?? "",
              ctaLabel: en?.ctaLabel ?? "",
              ctaHref: en?.ctaHref ?? "",
            },
          ],
        });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [announcementId]);

  const updateTranslation = (
    locale: "fr" | "en",
    field: "title" | "body" | "ctaLabel" | "ctaHref",
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      translations: prev.translations.map((tr) =>
        tr.locale === locale ? { ...tr, [field]: value } : tr,
      ),
    }));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const payload: AnnouncementInput = {
        slug: form.slug.trim(),
        priority: Number(form.priority) || 0,
        startsAt: form.startsAt,
        endsAt: form.endsAt,
        translations: form.translations
          .filter((tr) => tr.title.trim() && tr.body.trim())
          .map((tr) => ({
            locale: tr.locale,
            title: tr.title.trim(),
            body: tr.body.trim(),
            ctaLabel: tr.ctaLabel?.trim() || null,
            ctaHref: tr.ctaHref?.trim() || null,
          })),
      };

      if (isEdit && announcementId) {
        await updateAdminAnnouncement(announcementId, payload);
      } else {
        await createAdminAnnouncement(payload);
      }
      router.push("/admin/announcements");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className={styles.container}>
        <LoadingBar />
      </main>
    );
  }

  const fr = form.translations.find((tr) => tr.locale === "fr")!;
  const en = form.translations.find((tr) => tr.locale === "en")!;

  return (
    <main className={styles.container}>
      <PageHeader
        title={
          isEdit
            ? t("adminAnnouncementForm.editTitle")
            : t("adminAnnouncementForm.createTitle")
        }
        showBackButton
        path="/admin/announcements"
      />

      <form className={styles.form} onSubmit={(e) => void onSubmit(e)}>
        <TextField
          name="slug"
          label={t("adminAnnouncementForm.slug")}
          value={form.slug}
          onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
          fullWidth
          required
        />
        <TextField
          name="priority"
          label={t("adminAnnouncementForm.priority")}
          type="number"
          value={String(form.priority ?? 0)}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              priority: Number(e.target.value) || 0,
            }))
          }
          fullWidth
        />
        <label className={styles.dateField}>
          <span>{t("adminAnnouncementForm.startsAt")}</span>
          <input
            type="datetime-local"
            value={toDatetimeLocal(form.startsAt)}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                startsAt: fromDatetimeLocal(e.target.value),
              }))
            }
          />
        </label>
        <label className={styles.dateField}>
          <span>{t("adminAnnouncementForm.endsAt")}</span>
          <input
            type="datetime-local"
            value={toDatetimeLocal(form.endsAt)}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                endsAt: fromDatetimeLocal(e.target.value),
              }))
            }
          />
        </label>

        <section className={styles.localeBlock}>
          <h2>{t("adminAnnouncementForm.frSection")}</h2>
          <TextField
            name="fr-title"
            label={t("adminAnnouncementForm.title")}
            value={fr.title}
            onChange={(e) => updateTranslation("fr", "title", e.target.value)}
            fullWidth
            required
          />
          <TextField
            name="fr-body"
            label={t("adminAnnouncementForm.body")}
            value={fr.body}
            onChange={(e) => updateTranslation("fr", "body", e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
          />
          <TextField
            name="fr-ctaLabel"
            label={t("adminAnnouncementForm.ctaLabel")}
            value={fr.ctaLabel ?? ""}
            onChange={(e) => updateTranslation("fr", "ctaLabel", e.target.value)}
            fullWidth
          />
          <TextField
            name="fr-ctaHref"
            label={t("adminAnnouncementForm.ctaHref")}
            value={fr.ctaHref ?? ""}
            onChange={(e) => updateTranslation("fr", "ctaHref", e.target.value)}
            fullWidth
          />
        </section>

        <section className={styles.localeBlock}>
          <h2>{t("adminAnnouncementForm.enSection")}</h2>
          <TextField
            name="en-title"
            label={t("adminAnnouncementForm.title")}
            value={en.title}
            onChange={(e) => updateTranslation("en", "title", e.target.value)}
            fullWidth
          />
          <TextField
            name="en-body"
            label={t("adminAnnouncementForm.body")}
            value={en.body}
            onChange={(e) => updateTranslation("en", "body", e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
          <TextField
            name="en-ctaLabel"
            label={t("adminAnnouncementForm.ctaLabel")}
            value={en.ctaLabel ?? ""}
            onChange={(e) => updateTranslation("en", "ctaLabel", e.target.value)}
            fullWidth
          />
          <TextField
            name="en-ctaHref"
            label={t("adminAnnouncementForm.ctaHref")}
            value={en.ctaHref ?? ""}
            onChange={(e) => updateTranslation("en", "ctaHref", e.target.value)}
            fullWidth
          />
        </section>

        <Button type="submit" variant="primary" disabled={isSaving} fullWidth>
          {t("adminAnnouncementForm.save")}
        </Button>
      </form>
    </main>
  );
};

export default AdminAnnouncementFormContainer;
