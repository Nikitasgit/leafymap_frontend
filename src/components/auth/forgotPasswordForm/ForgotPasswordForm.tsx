"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./ForgotPasswordForm.module.scss";
import Button from "@/components/common/buttons/Button";
import LoadingBar from "@/components/common/loading/LoadingBar";
import TextField from "@/components/common/inputs/TextField";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { requestPasswordResetSchema } from "@/validations/authValidations";
import { useValidatedForm } from "@/hooks/useValidatedForm";
import { useTranslation } from "react-i18next";
import { validationT } from "@/utils/i18n/validationT";

export default function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { requestPasswordReset, loading } = usePasswordReset();
  const { t } = useTranslation("auth");
  const schema = useMemo(
    () => requestPasswordResetSchema(validationT(t)),
    [t],
  );

  const { values, errors, setField, handleSubmit } = useValidatedForm(
    schema,
    { email: "" },
  );

  const onSubmit = handleSubmit(async ({ email }) => {
    try {
      await requestPasswordReset(email);
      setIsSubmitted(true);
    } catch {
      // Error is handled by the hook
    }
  });

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1>{t("forgotPasswordForm.emailSentTitle")}</h1>
          <p className={styles.successMessage}>
            {t("forgotPasswordForm.successMessage")}
          </p>
          <Link href="/auth/signin">
            <Button variant="primary" size="medium" fullWidth>
              {t("forgotPasswordForm.backToSignin")}
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
        <h1>{t("forgotPasswordForm.title")}</h1>
        <p className={styles.description}>
          {t("forgotPasswordForm.description")}
        </p>

        <form onSubmit={onSubmit} className={styles.form} noValidate>
          <TextField
            label={t("forgotPasswordForm.emailLabel")}
            name="email"
            type="email"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            required
            placeholder={t("forgotPasswordForm.emailPlaceholder")}
            disabled={loading}
            error={!!errors.email}
            fullWidth
            errorMessage={errors.email}
          />

          <Button
            type="submit"
            variant="primary"
            size="medium"
            ariaLabel={t("forgotPasswordForm.sendResetLinkAriaLabel")}
            disabled={loading}
            fullWidth
          >
            {loading
              ? t("forgotPasswordForm.sendResetLinkLoading")
              : t("forgotPasswordForm.sendResetLink")}
          </Button>
        </form>

        <div className={styles.divider}>
          <span>{t("forgotPasswordForm.divider")}</span>
        </div>

        <p className={styles.signinLink}>
          {t("forgotPasswordForm.rememberPassword")}{" "}
          <Link href="/auth/signin">{t("common:nav.signin")}</Link>
        </p>
      </div>
    </div>
  );
}
