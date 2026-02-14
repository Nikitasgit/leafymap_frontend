"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import styles from "./VerifyEmailHandler.module.scss";
import Button from "@/components/common/buttons/Button";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { useToast } from "@/hooks/useToast";

/** Tokens for which verification has already been started (avoids duplicate calls in Strict Mode). */
const verificationStarted = new Set<string>();

interface VerifyEmailHandlerProps {
  token?: string;
}

export default function VerifyEmailHandler({ token }: VerifyEmailHandlerProps) {
  const { showError } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    if (verificationStarted.has(token)) return;
    verificationStarted.add(token);

    const verify = async () => {
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email`,
          { params: { token }, withCredentials: true },
        );
        setStatus("success");
      } catch (error) {
        verificationStarted.delete(token);
        setStatus("error");
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          showError(String(error.response.data.message));
        } else {
          showError("Lien invalide ou expiré.");
        }
      }
    };
    verify();
  }, [token, showError]);

  if (status === "loading") {
    return (
      <div className={styles.container}>
        <LoadingBar />
        <div className={styles.formContainer}>
          <p className={styles.description}>Vérification en cours...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1>Compte activé</h1>
          <p className={styles.description}>
            Votre adresse email a été vérifiée. Votre compte est activé, vous
            pouvez vous connecter.
          </p>
          <Link href="/auth/signin">
            <Button variant="primary" size="medium" fullWidth>
              Se connecter
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1>Lien invalide ou expiré</h1>
          <p className={styles.description}>
            Ce lien de vérification n&apos;est plus valable. Vous pouvez
            demander un nouveau lien ou vous connecter si votre compte est déjà
            activé.
          </p>
          <Link href="/auth/signin">
            <Button variant="primary" size="medium" fullWidth>
              Aller à la connexion
            </Button>
          </Link>
          <p className={styles.resendLink}>
            <Link href="/auth/resend-verification">
              Renvoyer un lien de vérification
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return null;
}
