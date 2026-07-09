"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GoogleOAuthProvider } from "@react-oauth/google";
import styles from "./SigninForm.module.scss";
import Button from "@/components/common/buttons/Button";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { RegisterFormGoogleLogin } from "@/components/auth/registerForm/RegisterFormGoogleLogin";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { loginSchema } from "@/validations/authValidations";
import { useValidatedForm } from "@/hooks/useValidatedForm";
import TextField from "@/components/common/inputs/TextField";
import { validationT } from "@/utils/i18n/validationT";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function SigninForm() {
  const { t } = useTranslation("subscription");
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const { login, loginWithGoogle, loading } = useAuth();
  const { showError } = useToast();
  const isSubmitting = loading || isGoogleSubmitting;

  const schema = useMemo(() => loginSchema(validationT(t)), [t]);
  const { values, errors, setField, handleSubmit } = useValidatedForm(
    schema,
    { identifier: "", password: "" },
  );

  const onSubmit = handleSubmit(async ({ identifier, password }) => {
    if (isSubmitting) return;
    await login(identifier, password);
  });

  const handleGoogleLogin = async (credential: string) => {
    if (isSubmitting) return;
    setIsGoogleSubmitting(true);
    await loginWithGoogle(credential);
    setIsGoogleSubmitting(false);
  };

  return (
    <div className={styles.container}>
      {isSubmitting && <LoadingBar />}

      <div className={styles.formContainer}>
        <h1>{t("signin.title")}</h1>

        <form onSubmit={onSubmit} className={styles.form} noValidate>
          <TextField
            label={t("signin.form.identifier.label")}
            name="identifier"
            type="text"
            value={values.identifier}
            onChange={(e) => setField("identifier", e.target.value)}
            required
            placeholder={t("signin.form.identifier.placeholder")}
            disabled={isSubmitting}
            error={!!errors.identifier}
            fullWidth
            errorMessage={errors.identifier}
          />

          <TextField
            label={t("signin.form.password.label")}
            name="password"
            type="password"
            value={values.password}
            onChange={(e) => setField("password", e.target.value)}
            required
            placeholder={t("signin.form.password.placeholder")}
            disabled={isSubmitting}
            error={!!errors.password}
            fullWidth
            errorMessage={errors.password}
          />

          <div className={styles.forgotPasswordLink}>
            <Link href="/auth/forgot-password">
              {t("auth:signinForm.forgotPasswordLink")}
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="medium"
            ariaLabel={t("signin.form.submit")}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t("signin.form.submitLoading")
              : t("signin.form.submit")}
          </Button>
        </form>

        {GOOGLE_CLIENT_ID && (
          <>
            <div className={styles.divider}>
              <span>{t("signin.divider")}</span>
            </div>
            <div className={styles.googleButton}>
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <RegisterFormGoogleLogin
                  loginWithGoogle={handleGoogleLogin}
                  onGoogleFlowError={() => {
                    showError(t("auth:signinForm.googleError"));
                  }}
                  loadingAriaLabel={t("googleButtonLoading")}
                  disabled={isSubmitting}
                  disabledLabel={t("signin.form.submitLoading")}
                />
              </GoogleOAuthProvider>
            </div>
          </>
        )}

        <p className={styles.signupLink}>
          {t("signin.signupLink.text")}
          <Link href="/auth/register">{t("signin.signupLink.link")}</Link>
        </p>
      </div>
    </div>
  );
}
