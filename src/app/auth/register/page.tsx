"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import styles from "./register.module.scss";
import { useToast } from "@/hooks/useToast";
import Button from "@/components/common/buttons/button/Button";
import { useLoading } from "@/hooks/useLoading";
import LoadingBar from "@/components/common/loading/LoadingBar";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { showSuccess, showError } = useToast();
  const { isLoading, withLoading } = useLoading();
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await withLoading(async () => {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
          {
            email,
            password,
            username,
          }
        );
        showSuccess("Inscription réussie ! Veuillez vous connecter.");
        router.push("/auth/signin");
      } catch (err: unknown) {
        const error = err as AxiosError<{ message: string }>;
        showError(error.response?.data?.message || "Échec de l'inscription");
      }
    });
  };

  return (
    <div className={styles.container}>
      {isLoading && <LoadingBar />}
      <div className={styles.formContainer}>
        <h1>S&apos;inscrire</h1>

        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Nom d&apos;utilisateur</label>
            <input
              id="username"
              type="text"
              placeholder="Entrez votre nom d'utilisateur"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Entrez votre email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              placeholder="Entrez votre mot de passe"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="medium"
            disabled={isLoading}
          >
            {isLoading ? "Inscription en cours..." : "S'inscrire"}
          </Button>
        </form>

        <div className={styles.divider}>
          <span>OU</span>
        </div>

        <p className={styles.signinLink}>
          Vous avez déjà un compte ?
          <Link href="/auth/signin">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
