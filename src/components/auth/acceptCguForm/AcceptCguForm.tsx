"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "./AcceptCguForm.module.scss";
import Button from "@/components/common/buttons/Button";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { useToast } from "@/hooks/useToast";

export default function AcceptCguForm() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const handleAccept = async () => {
    setLoading(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/accept-cgu`,
        {},
        { withCredentials: true }
      );
      showSuccess("Conditions générales acceptées");
      router.push("/account");
    } catch (error) {
      showError(
        axios.isAxiosError(error) && error.response?.data?.message
          ? String(error.response.data.message)
          : "Une erreur s'est produite"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading && <LoadingBar />}
      <div className={styles.formContainer}>
        <h1>Acceptation des conditions générales</h1>
        <p className={styles.description}>
          Pour continuer, veuillez accepter les{" "}
          <Link href="/legal/cgu" className={styles.link}>
            conditions générales d&apos;utilisation
          </Link>{" "}
          de SpotLight.
        </p>
        <Button
          type="button"
          variant="primary"
          size="medium"
          onClick={handleAccept}
          disabled={loading}
          fullWidth
        >
          J&apos;accepte les conditions générales
        </Button>
      </div>
    </div>
  );
}
