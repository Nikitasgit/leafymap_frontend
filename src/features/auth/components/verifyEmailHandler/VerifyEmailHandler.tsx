"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./VerifyEmailHandler.module.scss";
import Button from "@/shared/ui/buttons/button";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import { useToast } from "@/shared/hooks/useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/shared/utils/i18n/getErrorMessage";
import { authApi } from "../../api/authApi";

/** Tokens for which verification has already been started (avoids duplicate calls in Strict Mode). */
const verificationStarted = new Set<string>();

interface VerifyEmailHandlerProps {
  token?: string;
}

export default function VerifyEmailHandler({ token }: VerifyEmailHandlerProps) {
  const { showError } = useToast();
  const { t } = useTranslation("auth");
  const [status, setStatus] = useState<"loading" | "success" | "error">(() =>
    token ? "loading" : "error",
  );

  useEffect(() => {
    if (!token) return;
    if (verificationStarted.has(token)) return;
    verificationStarted.add(token);

    const verify = async () => {
      try {
        await authApi.verifyEmail(token);
        setStatus("success");
      } catch (error) {
        verificationStarted.delete(token);
        setStatus("error");
        showError(
          getErrorMessage(error, t, t("verifyEmailHandler.invalidLinkToast")),
        );
      }
    };
    void verify();
  }, [token, showError, t]);

  if (status === "loading") {
    return (
      <div className={styles.container}>
        <LoadingBar />
        <div className={styles.formContainer}>
          <p className={styles.description}>
            {t("verifyEmailHandler.verifying")}
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1>{t("verifyEmailHandler.successTitle")}</h1>
          <p className={styles.description}>
            {t("verifyEmailHandler.successDescription")}
          </p>
          <Link href="/auth/signin">
            <Button variant="primary" size="medium" fullWidth>
              {t("common:nav.signin")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1>{t("verifyEmailHandler.errorTitle")}</h1>
          <p className={styles.description}>
            {t("verifyEmailHandler.errorDescription")}
          </p>
          <Link href="/auth/signin">
            <Button variant="primary" size="medium" fullWidth>
              {t("verifyEmailHandler.goToSignin")}
            </Button>
          </Link>
          <p className={styles.resendLink}>
            <Link href="/auth/resend-verification">
              {t("verifyEmailHandler.resendLink")}
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return null;
}
