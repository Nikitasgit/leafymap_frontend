"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/utils/constants";
import styles from "./AccountConsentForm.module.scss";
import Button from "@/components/common/buttons/Button";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useToast } from "@/hooks/useToast";

export default function AccountConsentForm() {
  const [loading, setLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const handleAccept = async () => {
    setLoading(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/accept-cgu`,
        { emailNotifications },
        { withCredentials: true }
      );
      showSuccess("Préférences enregistrées");
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
        <h1>Finaliser votre compte</h1>
        <p className={styles.description}>
          Pour continuer, veuillez accepter les{" "}
          <Link href="/legal/cgu" className={styles.link}>
            conditions générales d&apos;utilisation
          </Link>{" "}
          de {APP_NAME}.
        </p>
        <label className={styles.emailNotificationsCheckbox}>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            disabled={loading}
          />
          <span>
            Je souhaite recevoir les notifications importantes par e-mail
            (messages, invitations, abonnés).
          </span>
        </label>
        <Button
          type="button"
          variant="primary"
          size="medium"
          onClick={handleAccept}
          disabled={loading}
          fullWidth
        >
          J&apos;accepte et je continue
        </Button>
      </div>
    </div>
  );
}
