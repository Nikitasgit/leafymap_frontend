"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./AccountConsentForm.module.scss";
import Button from "@/shared/ui/buttons/button";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import { useToast } from "@/shared/hooks/useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/shared/utils/i18n/getErrorMessage";
import { authApi } from "../../api/authApi";

export default function AccountConsentForm() {
  const [loading, setLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const { t } = useTranslation("auth");

  const handleAccept = async () => {
    setLoading(true);
    try {
      await authApi.acceptCgu({ emailNotifications });
      showSuccess(t("accountConsentForm.preferencesSaved"));
      router.push("/account");
    } catch (error) {
      showError(getErrorMessage(error, t));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading && <LoadingBar />}
      <div className={styles.formContainer}>
        <h1>{t("accountConsentForm.title")}</h1>
        <p className={styles.description}>
          {t("accountConsentForm.descriptionPrefix")}
          <Link href="/legal/cgu" className={styles.link}>
            {t("accountConsentForm.cguLink")}
          </Link>
          {t("accountConsentForm.descriptionSuffix")}
        </p>
        <label className={styles.emailNotificationsCheckbox}>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            disabled={loading}
          />
          <span>{t("accountConsentForm.emailNotifications")}</span>
        </label>
        <Button
          type="button"
          variant="primary"
          size="medium"
          onClick={handleAccept}
          disabled={loading}
          fullWidth
        >
          {t("accountConsentForm.acceptButton")}
        </Button>
      </div>
    </div>
  );
}
