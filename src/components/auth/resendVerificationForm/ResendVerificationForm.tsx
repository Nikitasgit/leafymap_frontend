"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import styles from "./ResendVerificationForm.module.scss";
import Button from "@/components/common/buttons/Button";
import LoadingBar from "@/components/common/loading/LoadingBar";
import TextField from "@/components/common/inputs/TextField";
import { useToast } from "@/hooks/useToast";
import { validateRequestPasswordResetData } from "@/validations/authValidations";

export default function ResendVerificationForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const validateFormData = useCallback((): boolean => {
    const validation = validateRequestPasswordResetData({ email });
    setErrors(validation.errors);
    return validation.isValid;
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    if (!validateFormData()) {
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-verification-email`,
        { email },
        { withCredentials: true },
      );
      showSuccess(
        "Si ce compte existe, un nouveau lien de vérification a été envoyé.",
      );
      setIsSubmitted(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        showError(String(error.response.data.message));
      } else {
        showError("Une erreur s'est produite.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasAttemptedSubmit) {
      validateFormData();
    }
  }, [hasAttemptedSubmit, validateFormData]);

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1>Email envoyé</h1>
          <p className={styles.successMessage}>
            Si cet email existe dans notre système, un nouveau lien de
            vérification vous a été envoyé. Vérifiez votre boîte de réception et
            vos spams.
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

  return (
    <div className={styles.container}>
      {loading && <LoadingBar />}
      <div className={styles.formContainer}>
        <h1>Renvoyer le lien de vérification</h1>
        <p className={styles.description}>
          Entrez votre adresse email pour recevoir un nouveau lien de
          vérification.
        </p>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="votre@email.com"
            disabled={loading}
            error={!!errors.email}
            fullWidth
            errorMessage={errors.email}
          />
          <Button
            type="submit"
            variant="primary"
            size="medium"
            fullWidth
            disabled={loading}
          >
            Envoyer le lien
          </Button>
        </form>
        <p className={styles.signinLink}>
          <Link href="/auth/signin">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}
