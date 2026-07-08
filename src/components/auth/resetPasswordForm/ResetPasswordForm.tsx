"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./ResetPasswordForm.module.scss";
import Button from "@/components/common/buttons/Button";
import LoadingBar from "@/components/common/loading/LoadingBar";
import TextField from "@/components/common/inputs/TextField";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import {
  validateResetPasswordData,
  ResetPasswordFormData,
} from "@/validations/authValidations";

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

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    token: tokenValue,
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const { resetPassword, loading } = usePasswordReset();

  useEffect(() => {
    if (tokenValue) {
      setFormData((prev) => ({ ...prev, token: tokenValue }));
    }
  }, [tokenValue]);

  useEffect(() => {
    if (!tokenValue) {
      router.push("/auth/forgot-password");
    }
  }, [tokenValue, router]);

  const validateFormData = useCallback((): boolean => {
    const validation = validateResetPasswordData(formData);
    setErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  const handleInputChange = (field: keyof ResetPasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    if (!validateFormData()) {
      return;
    }
    try {
      await resetPassword(formData.token, formData.newPassword);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  useEffect(() => {
    if (hasAttemptedSubmit) {
      validateFormData();
    }
  }, [hasAttemptedSubmit, validateFormData]);

  if (!tokenValue) {
    return null;
  }

  return (
    <div className={styles.container}>
      {loading && <LoadingBar />}

      <div className={styles.formContainer}>
        <h1>Réinitialiser votre mot de passe</h1>
        <p className={styles.description}>
          Entrez votre nouveau mot de passe ci-dessous.
        </p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <TextField
            label="Nouveau mot de passe"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={(e) => handleInputChange("newPassword", e.target.value)}
            required
            placeholder="Votre nouveau mot de passe"
            disabled={loading}
            error={!!errors.newPassword}
            fullWidth
            errorMessage={errors.newPassword}
          />

          <TextField
            label="Confirmer le mot de passe"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            required
            placeholder="Confirmez votre nouveau mot de passe"
            disabled={loading}
            error={!!errors.confirmPassword}
            fullWidth
            errorMessage={errors.confirmPassword}
          />

          <Button
            type="submit"
            variant="primary"
            size="medium"
            ariaLabel="Réinitialiser le mot de passe"
            disabled={loading}
            fullWidth
          >
            {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
          </Button>
        </form>

        <div className={styles.divider}>
          <span>ou</span>
        </div>

        <p className={styles.signinLink}>
          Vous vous souvenez de votre mot de passe ?{" "}
          <Link href="/auth/signin">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
