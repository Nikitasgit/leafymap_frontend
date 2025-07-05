"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./signin.module.scss";
import { useAppDispatch } from "@/store";
import { fetchUser } from "@/store/userSlice";
import { useToast } from "@/hooks/useToast";
import { useLoading } from "@/hooks/useLoading";
import Button from "@/components/common/buttons/button/Button";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useTranslation } from "react-i18next";

export default function SignIn() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation("subscription");
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();
  const { isLoading, withLoading } = useLoading();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await withLoading(async () => {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
          {
            identifier,
            password,
          },
          { withCredentials: true }
        );
        dispatch(fetchUser());
        showSuccess(t("signin.messages.success"));
        router.push("/");
      } catch (err: unknown) {
        const error = err as AxiosError<{ message: string }>;
        showError(error.response?.data?.message || t("signin.messages.error"));
      }
    });
  };

  return (
    <div className={styles.container}>
      {isLoading && <LoadingBar />}

      <div className={styles.formContainer}>
        <h1>{t("signin.title")}</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="identifier">
              {t("signin.form.identifier.label")}
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder={t("signin.form.identifier.placeholder")}
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">{t("signin.form.password.label")}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t("signin.form.password.placeholder")}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="medium"
            disabled={isLoading}
          >
            {isLoading
              ? t("signin.form.submitLoading")
              : t("signin.form.submit")}
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
