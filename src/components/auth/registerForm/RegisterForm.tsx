"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import styles from "./RegisterForm.module.scss";
import Button from "@/components/common/buttons/Button";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import TextField from "@/components/common/inputs/TextField/TextField";
import CGUCheckbox from "@/components/common/inputs/CguCheckbox";
import { useRegister } from "@/hooks/useRegister";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function RegisterForm() {
  const { t } = useTranslation("subscription");
  const { loginWithGoogle, loading: authLoading } = useAuth();
  const { showError } = useToast();

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

  return (
    <div className={styles.container}>
      {(isLoading || authLoading) && <LoadingBar />}
      <div className={styles.formContainer}>
        <h1>{t("title")}</h1>
        <form
          onSubmit={handleRegister}
          className={styles.form}
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

          <Button
            type="submit"
            variant="primary"
            size="medium"
            disabled={isLoading || authLoading}
          >
            {isLoading ? t("form.submitLoading") : t("form.submit")}
          </Button>
        </form>

        <div className={styles.divider}>
          <span>{t("divider")}</span>
        </div>

        {GOOGLE_CLIENT_ID && (
          <div className={styles.googleButton}>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={(res) => {
                  if (res.credential) {
                    loginWithGoogle(res.credential);
                  }
                }}
                onError={() => {
                  showError("Inscription Google annulée ou échouée");
                }}
                useOneTap={false}
                theme="outline"
                size="large"
                text="continue_with"
              />
            </GoogleOAuthProvider>
          </div>
        )}

        <p className={styles.signinLink}>
          {t("signinLink.text")}
          <Link href="/auth/signin">{t("signinLink.link")}</Link>
        </p>
      </div>
    </div>
  );
}
