"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./ResetPasswordForm.module.scss";
import Button from "@/shared/ui/buttons/button";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import TextField from "@/shared/ui/inputs/textField";
import { usePasswordReset } from "../../hooks/usePasswordReset";
import { resetPasswordSchema } from "../../validations/authValidations";
import { useValidatedForm } from "@/shared/hooks/useValidatedForm";
import { useTranslation } from "react-i18next";
import { validationT } from "@/shared/utils/i18n/validationT";

interface ResetPasswordFormProps {
  token?: string;
}

export default function ResetPasswordForm({
  token: tokenProp,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const tokenValue = tokenFromUrl ?? tokenProp ?? "";
  const { resetPassword, loading } = usePasswordReset();
  const { t } = useTranslation("auth");
  const schema = useMemo(() => resetPasswordSchema(validationT(t)), [t]);

  const { values, errors, setField, setValues, handleSubmit } =
    useValidatedForm(schema, {
      token: tokenValue,
      newPassword: "",
      confirmPassword: "",
    });

  useEffect(() => {
    if (tokenValue) {
      setValues((prev) => ({ ...prev, token: tokenValue }));
    }
  }, [tokenValue, setValues]);

  useEffect(() => {
    if (!tokenValue) {
      router.push("/auth/forgot-password");
    }
  }, [tokenValue, router]);

  const onSubmit = handleSubmit(async ({ token, newPassword }) => {
    try {
      await resetPassword(token, newPassword);
    } catch {
      // Error is handled by the hook
    }
  });

  if (!tokenValue) {
    return null;
  }

  return (
    <div className={styles.container}>
      {loading && <LoadingBar />}

      <div className={styles.formContainer}>
        <h1>{t("resetPasswordForm.title")}</h1>
        <p className={styles.description}>
          {t("resetPasswordForm.description")}
        </p>

        <form onSubmit={onSubmit} className={styles.form} noValidate>
          <TextField
            label={t("resetPasswordForm.newPasswordLabel")}
            name="newPassword"
            type="password"
            value={values.newPassword}
            onChange={(e) => setField("newPassword", e.target.value)}
            required
            placeholder={t("resetPasswordForm.newPasswordPlaceholder")}
            disabled={loading}
            error={!!errors.newPassword}
            fullWidth
            errorMessage={errors.newPassword}
          />

          <TextField
            label={t("resetPasswordForm.confirmPasswordLabel")}
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={(e) => setField("confirmPassword", e.target.value)}
            required
            placeholder={t("resetPasswordForm.confirmPasswordPlaceholder")}
            disabled={loading}
            error={!!errors.confirmPassword}
            fullWidth
            errorMessage={errors.confirmPassword}
          />

          <Button
            type="submit"
            variant="primary"
            size="medium"
            ariaLabel={t("resetPasswordForm.submitAriaLabel")}
            disabled={loading}
            fullWidth
          >
            {loading
              ? t("resetPasswordForm.submitLoading")
              : t("resetPasswordForm.submit")}
          </Button>
        </form>

        <div className={styles.divider}>
          <span>{t("resetPasswordForm.divider")}</span>
        </div>

        <p className={styles.signinLink}>
          {t("resetPasswordForm.rememberPassword")}{" "}
          <Link href="/auth/signin">{t("common:nav.signin")}</Link>
        </p>
      </div>
    </div>
  );
}
