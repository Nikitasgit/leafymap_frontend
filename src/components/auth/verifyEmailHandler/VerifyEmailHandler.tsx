"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import styles from "./VerifyEmailHandler.module.scss";
import Button from "@/components/common/buttons/Button";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

/** Tokens for which verification has already been started (avoids duplicate calls in Strict Mode). */
const verificationStarted = new Set<string>();

interface VerifyEmailHandlerProps {
  token?: string;
}

export default function VerifyEmailHandler({ token }: VerifyEmailHandlerProps) {
  const { showError } = useToast();
  const { t } = useTranslation("auth");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    if (verificationStarted.has(token)) return;
    verificationStarted.add(token);

    const verify = async () => {
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email`,
          { params: { token }, withCredentials: true },
        );
        setStatus("success");
      } catch (error) {
        verificationStarted.delete(token);
        setStatus("error");
        showError(
          getErrorMessage(error, t, t("verifyEmailHandler.invalidLinkToast")),
        );
      }
    };
    verify();
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
