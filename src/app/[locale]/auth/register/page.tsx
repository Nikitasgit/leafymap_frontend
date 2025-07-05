"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import styles from "./register.module.scss";
import { useToast } from "@/hooks/useToast";
import Button from "@/components/common/buttons/button/Button";
import { useLoading } from "@/hooks/useLoading";
import LoadingBar from "@/components/common/loading/LoadingBar";
import TextField from "@/components/common/inputs/textField/TextField";
import {
  registerSchema,
  getValidationErrors,
  type RegisterFormData,
} from "@/validations/authValidations";
import { z } from "zod";

export default function Register() {
  const router = useRouter();
  const { t } = useTranslation("subscription");
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showSuccess, showError } = useToast();
  const { isLoading, withLoading } = useLoading();

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      registerSchema.parse(formData);
      await withLoading(async () => {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
            {
              email: formData.email,
              password: formData.password,
              username: formData.username,
            }
          );
          showSuccess(t("messages.success"));
          router.push("/auth/signin");
        } catch (err: unknown) {
          const error = err as AxiosError<{ message: string }>;
          showError(error.response?.data?.message || t("messages.error"));
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = getValidationErrors(error);
        setErrors(validationErrors);
        showError(t("messages.validationError"));
      }
    }
  };

  return (
    <div className={styles.container}>
      {isLoading && <LoadingBar />}
      <div className={styles.formContainer}>
        <h1>{t("title")}</h1>

        <form onSubmit={handleRegister} className={styles.form}>
          <TextField
            label={t("form.email.label")}
            name="email"
            type="email"
            placeholder={t("form.email.placeholder")}
            required
            fullWidth
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={isLoading}
            error={!!errors.email}
            errorMessage={errors.email}
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
            error={!!errors.username}
            errorMessage={errors.username}
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
            error={!!errors.password}
            errorMessage={errors.password}
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
            error={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword}
          />

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
