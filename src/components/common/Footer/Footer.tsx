import React from "react";
import Link from "next/link";
import { APP_NAME } from "@/utils/constants";
import styles from "./Footer.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.text}>© 2025 {APP_NAME}. Tous droits réservés.</p>
          <Link href="/legal/cgu" className={styles.link}>
            Conditions Générales d&apos;Utilisation
          </Link>
          <p className={styles.text}>
            Support:{" "}
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
