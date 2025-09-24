import React from "react";
import Link from "next/link";
import styles from "./Footer.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.text}>© 2025 SpotLight. Tous droits réservés.</p>
          <Link href="/legal/cgu" className={styles.link}>
            Conditions Générales d&apos;Utilisation
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
