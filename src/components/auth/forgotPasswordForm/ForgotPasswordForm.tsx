"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import styles from "./ForgotPasswordForm.module.scss";
import Button from "@/components/common/buttons/Button";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import TextField from "@/components/common/inputs/TextField/TextField";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import {
  validateRequestPasswordResetData,
  RequestPasswordResetFormData,
} from "@/validations/authValidations";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { requestPasswordReset, loading } = usePasswordReset();

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
    try {
      await requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by the hook
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
            Si cet email existe dans notre système, un lien de réinitialisation
            vous a été envoyé. Veuillez vérifier votre boîte de réception.
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
        <h1>Mot de passe oublié</h1>
        <p className={styles.description}>
          Entrez votre adresse email et nous vous enverrons un lien pour
          réinitialiser votre mot de passe.
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
            ariaLabel="Envoyer le lien de réinitialisation"
            disabled={loading}
            fullWidth
          >
            {loading ? "Envoi en cours..." : "Envoyer le lien"}
          </Button>
        </form>

        <div className={styles.divider}>
          <span>ou</span>
        </div>

        <p className={styles.signinLink}>
          Vous vous souvenez de votre mot de passe ?{" "}
          <Link href="/auth/signin">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
