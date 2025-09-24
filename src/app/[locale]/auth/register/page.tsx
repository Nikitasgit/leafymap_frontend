"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import styles from "./register.module.scss";
import { useToast } from "@/hooks/useToast";
import useHandleApiErrors from "@/hooks/useHandleApiErrors";
import Button from "@/components/common/buttons/button/Button";
import { useLoading } from "@/hooks/useLoading";
import LoadingBar from "@/components/common/loading/LoadingBar";
import TextField from "@/components/common/inputs/textField/TextField";
import { validateRegisterData } from "@/validations/authValidations";
import { RegisterFormData } from "@/types/auth";

export default function Register() {
  const router = useRouter();
  const { t } = useTranslation("subscription");
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedCGU: false,
  });
  const [errors, setErrors] = useState<{
    register: Record<string, string>;
  }>({ register: {} });
  const { showSuccess } = useToast();
  const { isLoading, withLoading } = useLoading();
  const { handleApiError } = useHandleApiErrors();
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const handleInputChange = (
    field: keyof RegisterFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateFormData = useCallback((): boolean => {
    const registerValidation = validateRegisterData(formData);
    setErrors((prev) => ({
      ...prev,
      register: registerValidation.errors,
    }));
    return registerValidation.isValid;
  }, [formData]);

  useEffect(() => {
    if (hasAttemptedSubmit) {
      validateFormData();
    }
  }, [hasAttemptedSubmit, validateFormData]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    if (!validateFormData()) {
      return;
    }
    try {
      await withLoading(async () => {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
            {
              email: formData.email,
              password: formData.password,
              username: formData.username,
              acceptedCGU: formData.acceptedCGU,
            }
          );
          showSuccess(t("messages.success"));
          router.push("/auth/signin");
        } catch (err: unknown) {
          handleApiError(
            err,
            (validationErrors) => {
              setErrors((prev) => ({
                ...prev,
                register: validationErrors,
              }));
            },
            false
          );
        }
      });
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className={styles.container}>
      {isLoading && <LoadingBar />}
      <div className={styles.formContainer}>
        <h1>{t("title")}</h1>

        <form onSubmit={handleRegister} className={styles.form} noValidate>
          <TextField
            label={t("form.email.label")}
            name="email"
            type="text"
            placeholder={t("form.email.placeholder")}
            required
            fullWidth
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={isLoading}
            error={!!errors.register.email}
            errorMessage={errors.register.email}
          />

          <TextField
            label={t("form.username.label")}
            name="username"
            type="text"
            placeholder={t("form.username.placeholder")}
            required
            fullWidth
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            disabled={isLoading}
            error={!!errors.register.username}
            errorMessage={errors.register.username}
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
            disabled={isLoading}
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
            disabled={isLoading}
            error={!!errors.register.confirmPassword}
            errorMessage={errors.register.confirmPassword}
          />

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.acceptedCGU}
                onChange={(e) =>
                  handleInputChange("acceptedCGU", e.target.checked)
                }
                disabled={isLoading}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                J&apos;accepte les{" "}
                <Link href="/legal/cgu" className={styles.cguLink}>
                  Conditions Générales d&apos;Utilisation
                </Link>
              </span>
            </label>
            {errors.register.acceptedCGU && (
              <span className={styles.errorMessage}>
                {errors.register.acceptedCGU}
              </span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="medium"
            disabled={isLoading}
          >
            {isLoading ? t("form.submitLoading") : t("form.submit")}
          </Button>
        </form>

        <div className={styles.divider}>
          <span>{t("divider")}</span>
        </div>

        <p className={styles.signinLink}>
          {t("signinLink.text")}
          <Link href="/auth/signin">{t("signinLink.link")}</Link>
        </p>
      </div>
    </div>
  );
}
