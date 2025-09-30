"use client";

import React from "react";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/common/buttons/button/Button";
import InfoIcon from "@/components/common/Tooltip/Tooltip";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { Trash2 } from "lucide-react";
import styles from "./AccountSettingsContainer.module.scss";

const AccountSettingsContainer = () => {
  const { deleteAccount, isLoading } = useDeleteAccount();

  return (
    <div className={styles.pageContainer}>
      <section className={styles.container}>
        <PageHeader
          subtitle="Gérez vos paramètres de compte"
          title="Paramètres du compte"
          showBackButton
        />
        <div className={styles.settingsContainer}>
          <div className={styles.deleteAccountCard}>
            <div className={styles.deleteAccountInfo}>
              <div className={styles.titleRow}>
                <h4 className={styles.deleteTitle}>Supprimer mon compte</h4>
                <InfoIcon
                  tooltip="La suppression de votre compte entraînera la suppression définitive de : • Tous vos lieux • Tous vos événements • Tous vos partenariats • Tous vos avis et commentaires • Votre profil utilisateur. Cette action est irréversible et ne peut pas être annulée."
                  place="right"
                  className={styles.infoIcon}
                />
              </div>
              <p className={styles.deleteDescription}>
                Suppression définitive de votre compte et de toutes vos données.
                Cette action est irréversible.
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={deleteAccount}
              disabled={isLoading}
              startIcon={<Trash2 size={16} />}
              ariaLabel="Supprimer mon compte"
            >
              {isLoading ? "Suppression..." : "Supprimer"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccountSettingsContainer;
