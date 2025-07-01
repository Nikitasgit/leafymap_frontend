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

export default function SignIn() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
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
        showSuccess("Connexion réussie !");
        router.push("/");
      } catch (err: unknown) {
        const error = err as AxiosError<{ message: string }>;
        showError(error.response?.data?.message || "Échec de la connexion");
      }
    });
  };

  return (
    <div className={styles.container}>
      {isLoading && <LoadingBar />}

      <div className={styles.formContainer}>
        <h1>Se connecter</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="identifier">Nom d&apos;utilisateur ou Email</label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder="Entrez votre nom d'utilisateur ou email"
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Entrez votre mot de passe"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="medium"
            disabled={isLoading}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>

        <div className={styles.divider}>
          <span>OU</span>
        </div>

        <p className={styles.signupLink}>
          Vous n&apos;avez pas de compte ?
          <Link href="/auth/register">S&apos;inscrire</Link>
        </p>
      </div>
    </div>
  );
}
