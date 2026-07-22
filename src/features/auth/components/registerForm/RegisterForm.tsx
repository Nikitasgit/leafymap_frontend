"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RegisterFormGoogleLogin } from "./RegisterFormGoogleLogin";
import styles from "./RegisterForm.module.scss";
import Button from "@/shared/ui/buttons/button";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import TextField from "@/shared/ui/inputs/textField";
import CGUCheckbox from "@/shared/ui/inputs/cguCheckbox";
import { useRegister } from "../../hooks/useRegister";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "@/shared/hooks/useToast";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function RegisterForm() {
  const { t } = useTranslation("subscription");
  const { loginWithGoogle, loading: authLoading } = useAuth();
  const { showError } = useToast();

  const hasGoogleAuth = Boolean(GOOGLE_CLIENT_ID);
  const [showEmailForm, setShowEmailForm] = useState(!hasGoogleAuth);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const isAuthSubmitting = authLoading || isGoogleSubmitting;

  const {
    formData,
    errors,
    isLoading,
    hasAttemptedSubmit,
    handleInputChange,
    handleRegister,
    validateFormData,
  } = useRegister();

  useEffect(() => {
    if (hasAttemptedSubmit) {
      validateFormData();
    }
  }, [hasAttemptedSubmit, validateFormData]);

  const handleGoogleLogin = async (credential: string) => {
    if (isAuthSubmitting) {
      return;
    }

    setIsGoogleSubmitting(true);
    await loginWithGoogle(credential);
    setIsGoogleSubmitting(false);
  };

  const googleBlock = hasGoogleAuth && (
    <div className={styles.googlePrimary}>
      <p className={styles.recommendedLabel}>{t("recommended")}</p>
      <div className={styles.googleButton}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID!}>
          <RegisterFormGoogleLogin
            loginWithGoogle={handleGoogleLogin}
            onGoogleFlowError={() => {
              showError(t("auth:registerForm.googleError"));
            }}
            loadingAriaLabel={t("googleButtonLoading")}
            disabled={isAuthSubmitting}
            disabledLabel={t("form.submitLoading")}
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );

  const emailForm = (
    <form
      onSubmit={handleRegister}
      className={`${styles.form} ${hasGoogleAuth ? styles.formAfterGoogle : ""}`}
      noValidate
      aria-label={t("form.ariaLabel")}
    >
      <TextField
        label={t("form.email.label")}
        name="email"
        type="text"
        placeholder={t("form.email.placeholder")}
        required
        fullWidth
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        disabled={isLoading || isAuthSubmitting}
        error={!!errors.register.email}
        errorMessage={errors.register.email}
      />

      <TextField
        label={t("form.password.label")}
        name="password"
        type="password"
        placeholder={t("form.password.placeholder")}
        required
        fullWidth
        value={formData.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        disabled={isLoading || isAuthSubmitting}
        error={!!errors.register.password}
        errorMessage={errors.register.password}
      />

      <TextField
        label={t("form.confirmPassword.label")}
        name="confirmPassword"
        type="password"
        placeholder={t("form.confirmPassword.placeholder")}
        required
        fullWidth
        value={formData.confirmPassword}
        onChange={(e) =>
          handleInputChange("confirmPassword", e.target.value)
        }
        disabled={isLoading || isAuthSubmitting}
        error={!!errors.register.confirmPassword}
        errorMessage={errors.register.confirmPassword}
      />

      <CGUCheckbox
        checked={formData.acceptedCGU}
        onChange={(checked) => handleInputChange("acceptedCGU", checked)}
        disabled={isLoading || isAuthSubmitting}
        error={!!errors.register.acceptedCGU}
        errorMessage={errors.register.acceptedCGU}
      />

      <label className={styles.emailNotificationsCheckbox}>
        <input
          type="checkbox"
          checked={formData.emailNotifications}
          onChange={(e) =>
            handleInputChange("emailNotifications", e.target.checked)
          }
          disabled={isLoading || isAuthSubmitting}
        />
        <span>{t("emailNotificationsLabel")}</span>
      </label>

      <Button
        type="submit"
        variant="primary"
        size="medium"
        disabled={isLoading || isAuthSubmitting}
      >
        {isLoading || isAuthSubmitting
          ? t("form.submitLoading")
          : t("form.submit")}
      </Button>
    </form>
  );

  return (
    <div className={styles.container}>
      {(isLoading || isAuthSubmitting) && <LoadingBar />}
      <div className={styles.formContainer}>
        <h1>{t("title")}</h1>

        {googleBlock}

        {hasGoogleAuth && (
          <div className={styles.divider} role="separator">
            <span>{t("divider")}</span>
          </div>
        )}

        {hasGoogleAuth && (
          <Button
            type="button"
            variant="secondary"
            size="medium"
            fullWidth
            className={styles.emailToggle}
            onClick={() => setShowEmailForm((open) => !open)}
            disabled={isLoading || isAuthSubmitting}
            aria-expanded={showEmailForm}
          >
            {showEmailForm ? t("hideEmailForm") : t("registerWithEmail")}
          </Button>
        )}

        {(!hasGoogleAuth || showEmailForm) && emailForm}

        <p className={styles.signinLink}>
          {t("signinLink.text")}
          <Link href="/auth/signin">{t("signinLink.link")}</Link>
        </p>
      </div>
    </div>
  );
}
