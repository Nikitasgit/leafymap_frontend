"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import styles from "./ResendVerificationForm.module.scss";
import Button from "@/shared/ui/buttons/button";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import TextField from "@/shared/ui/inputs/textField";
import { useToast } from "@/shared/hooks/useToast";
import { validateRequestPasswordResetData } from "../../validations/authValidations";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/shared/utils/i18n/getErrorMessage";
import { validationT } from "@/shared/utils/i18n/validationT";
import { authApi } from "../../api/authApi";

export default function ResendVerificationForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation("auth");

  const validateFormData = useCallback((): boolean => {
    const validation = validateRequestPasswordResetData(validationT(t))({ email });
    setErrors(validation.errors);
    return validation.isValid;
  }, [email, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    if (!validateFormData()) {
      return;
    }
    setLoading(true);
    try {
      await authApi.resendVerificationEmail(email);
      showSuccess(t("resendVerificationForm.toastSuccess"));
      setIsSubmitted(true);
    } catch (error) {
      showError(getErrorMessage(error, t));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasAttemptedSubmit) {
      validateFormData();
    }
  }, [hasAttemptedSubmit, validateFormData]);

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1>{t("resendVerificationForm.emailSentTitle")}</h1>
          <p className={styles.successMessage}>
            {t("resendVerificationForm.successMessage")}
          </p>
          <Link href="/auth/signin">
            <Button variant="primary" size="medium" fullWidth>
              {t("resendVerificationForm.backToSignin")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {loading && <LoadingBar />}
      <div className={styles.formContainer}>
        <h1>{t("resendVerificationForm.title")}</h1>
        <p className={styles.description}>
          {t("resendVerificationForm.description")}
        </p>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <TextField
            label={t("resendVerificationForm.emailLabel")}
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={t("resendVerificationForm.emailPlaceholder")}
            disabled={loading}
            error={!!errors.email}
            fullWidth
            errorMessage={errors.email}
          />
          <Button
            type="submit"
            variant="primary"
            size="medium"
            fullWidth
            disabled={loading}
          >
            {t("resendVerificationForm.sendLink")}
          </Button>
        </form>
        <p className={styles.signinLink}>
          <Link href="/auth/signin">
            {t("resendVerificationForm.backToSignin")}
          </Link>
        </p>
      </div>
    </div>
  );
}
