"use client";

import PageHeader from "@/components/common/PageHeader/PageHeader";
import React from "react";
import styles from "./pageSettings.module.scss";
import Button from "@/components/common/buttons/button/Button";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { Trash2 } from "lucide-react";
import InfoIcon from "@/components/common/info/InfoIcon";
import Text from "@/components/common/typography/Text";
import { useRouter } from "next/navigation";

const Page = () => {
  const { deleteAccount, isLoading } = useDeleteAccount();
  const router = useRouter();

  return (
    <main className={styles.pageContainer}>
      <section className={styles.container}>
        <PageHeader
          backButtonLabel="Retour au compte"
          subtitle="Gérez vos paramètres de compte"
          title="Paramètres du compte"
          onBackClick={() => router.back()}
          showBackButton
        />
        <div className={styles.settingsContainer}>
          <div className={styles.deleteAccountCard}>
            <div className={styles.deleteAccountInfo}>
              <div className={styles.titleRow}>
                <Text as="h4" className={styles.deleteTitle}>
                  Supprimer mon compte
                </Text>
                <InfoIcon
                  tooltip="La suppression de votre compte entraînera la suppression définitive de : • Tous vos lieux • Tous vos événements • Tous vos partenariats • Tous vos avis et commentaires • Votre profil utilisateur. Cette action est irréversible et ne peut pas être annulée."
                  place="right"
                  className={styles.infoIcon}
                />
              </div>
              <Text as="p" className={styles.deleteDescription}>
                Suppression définitive de votre compte et de toutes vos données.
                Cette action est irréversible.
              </Text>
            </div>

            <Button
              variant="secondary"
              onClick={deleteAccount}
              disabled={isLoading}
              startIcon={<Trash2 size={16} />}
            >
              {isLoading ? "Suppression..." : "Supprimer"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
