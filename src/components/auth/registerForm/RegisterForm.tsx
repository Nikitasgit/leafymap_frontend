"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RegisterFormGoogleLogin } from "./RegisterFormGoogleLogin";
import styles from "./RegisterForm.module.scss";
import Button from "@/components/common/buttons/Button";
import LoadingBar from "@/components/common/loading/LoadingBar";
import TextField from "@/components/common/inputs/TextField";
import CGUCheckbox from "@/components/common/inputs/CguCheckbox";
import { useRegister } from "@/hooks/useRegister";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function RegisterForm() {
  const { t } = useTranslation("subscription");
  const { loginWithGoogle, loading: authLoading } = useAuth();
  const { showError } = useToast();

  const hasGoogleAuth = Boolean(GOOGLE_CLIENT_ID);
  const [showEmailForm, setShowEmailForm] = useState(!hasGoogleAuth);

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

  const googleBlock = hasGoogleAuth && (
    <div className={styles.googlePrimary}>
      <p className={styles.recommendedLabel}>{t("recommended")}</p>
      <div className={styles.googleButton}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID!}>
          <RegisterFormGoogleLogin
            loginWithGoogle={loginWithGoogle}
            onGoogleFlowError={() => {
              showError("Inscription Google annulée ou échouée");
            }}
            loadingAriaLabel={t("googleButtonLoading")}
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
      aria-label="Formulaire d'inscription"
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
        disabled={isLoading || authLoading}
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
        disabled={isLoading || authLoading}
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
        disabled={isLoading || authLoading}
        error={!!errors.register.confirmPassword}
        errorMessage={errors.register.confirmPassword}
      />

      <CGUCheckbox
        checked={formData.acceptedCGU}
        onChange={(checked) => handleInputChange("acceptedCGU", checked)}
        disabled={isLoading || authLoading}
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
          disabled={isLoading || authLoading}
        />
        <span>
          Je souhaite recevoir les notifications importantes par e-mail
          (messages, invitations, abonnés).
        </span>
      </label>

      <Button
        type="submit"
        variant="primary"
        size="medium"
        disabled={isLoading || authLoading}
      >
        {isLoading ? t("form.submitLoading") : t("form.submit")}
      </Button>
    </form>
  );

  return (
    <div className={styles.container}>
      {(isLoading || authLoading) && <LoadingBar />}
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
            disabled={isLoading || authLoading}
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
