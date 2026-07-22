"use client";

import Link from "next/link";
import styles from "./CheckEmailMessage.module.scss";
import Button from "@/shared/ui/buttons/button";
import { useTranslation } from "react-i18next";

export default function CheckEmailMessage() {
  const { t } = useTranslation("auth");

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>{t("checkEmailMessage.title")}</h1>
        <p className={styles.description}>
          {t("checkEmailMessage.description")}
        </p>
        <p className={styles.checkSpam}>{t("checkEmailMessage.checkSpam")}</p>
        <Link href="/auth/signin">
          <Button variant="primary" size="medium" fullWidth>
            {t("checkEmailMessage.backToSignin")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
