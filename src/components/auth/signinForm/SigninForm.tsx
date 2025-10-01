"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import styles from "./SigninForm.module.scss";
import Button from "@/components/common/buttons/Buttontempname";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { validateLoginData } from "@/validations/authValidations";
import TextField from "@/components/common/inputs/TextField/TextField";

export default function SigninForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    signin: Record<string, string>;
  }>({ signin: {} });
  const { t } = useTranslation("subscription");
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const { login, loading } = useAuth();

  const validateFormData = useCallback((): boolean => {
    const signinValidation = validateLoginData({
      identifier,
      password,
    });
    setErrors((prev) => ({
      ...prev,
      signin: signinValidation.errors,
    }));
    return signinValidation.isValid;
  }, [identifier, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    if (!validateFormData()) {
      return;
    }
    await login(identifier, password);
  };

  useEffect(() => {
    if (hasAttemptedSubmit) {
      validateFormData();
    }
  }, [hasAttemptedSubmit, validateFormData]);

  return (
    <div className={styles.container}>
      {loading && <LoadingBar />}

      <div className={styles.formContainer}>
        <h1>{t("signin.title")}</h1>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <TextField
            label={t("signin.form.identifier.label")}
            name="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            placeholder={t("signin.form.identifier.placeholder")}
            disabled={loading}
            error={!!errors.signin.identifier}
            fullWidth
            errorMessage={errors.signin.identifier}
          />

          <TextField
            label={t("signin.form.password.label")}
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder={t("signin.form.password.placeholder")}
            disabled={loading}
            error={!!errors.signin.password}
            fullWidth
            errorMessage={errors.signin.password}
          />

          <Button
            type="submit"
            variant="primary"
            size="medium"
            ariaLabel={t("signin.form.submit")}
            disabled={loading}
          >
            {loading ? t("signin.form.submitLoading") : t("signin.form.submit")}
          </Button>
        </form>

        <div className={styles.divider}>
          <span>{t("signin.divider")}</span>
        </div>

        <p className={styles.signupLink}>
          {t("signin.signupLink.text")}
          <Link href="/auth/register">{t("signin.signupLink.link")}</Link>
        </p>
      </div>
    </div>
  );
}
