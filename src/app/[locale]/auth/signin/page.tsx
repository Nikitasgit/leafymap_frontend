"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./signin.module.scss";
import Button from "@/components/common/buttons/button/Button";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";

export default function SignIn() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation("subscription");

  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(identifier, password);
  };

  return (
    <div className={styles.container}>
      {loading && <LoadingBar />}

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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="medium"
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
