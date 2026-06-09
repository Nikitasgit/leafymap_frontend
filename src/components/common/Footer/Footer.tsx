"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import styles from "./Footer.module.scss";

const Footer: React.FC = () => {
  const { t } = useTranslation("marketing");

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.text}>{t("footer.copyright")}</p>
          <Link href="/legal/cgu" className={styles.link}>
            {t("footer.cgu")}
          </Link>
          <p className={styles.text}>
            {t("footer.support")}{" "}
            <a href="mailto:victorleman1@gmail.com" className={styles.link}>
              victorleman1@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
