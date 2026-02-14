"use client";

import Link from "next/link";
import styles from "./CheckEmailMessage.module.scss";
import Button from "@/components/common/buttons/Button";

export default function CheckEmailMessage() {
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>Consultez votre boîte de réception</h1>
        <p className={styles.description}>
          Nous vous avons envoyé un email avec un lien pour vérifier votre
          adresse et activer votre compte. Le lien est valide 15 minutes.
        </p>
        <p className={styles.checkSpam}>
          Si vous ne voyez pas l&apos;email, vérifiez votre dossier spam ou
          indésirables.
        </p>
        <Link href="/auth/signin">
          <Button variant="primary" size="medium" fullWidth>
            Retour à la connexion
          </Button>
        </Link>
      </div>
    </div>
  );
}
