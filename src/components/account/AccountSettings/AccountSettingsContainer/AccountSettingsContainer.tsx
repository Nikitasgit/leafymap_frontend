"use client";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/common/buttons/Button";
import InfoIcon from "@/components/common/Tooltip/Tooltip";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { Trash2 } from "lucide-react";
import styles from "./AccountSettingsContainer.module.scss";

const AccountSettingsContainer = () => {
  const { deleteAccount, isLoading } = useDeleteAccount();

  return (
    <div className={styles.pageContainer}>
      <section className={styles.container} aria-labelledby="settings-title">
        <PageHeader
          subtitle="Gérez vos paramètres de compte"
          title="Paramètres du compte"
          showBackButton
        />
        <section
          className={styles.settingsContainer}
          aria-labelledby="danger-zone-title"
        >
          <article className={styles.deleteAccountCard}>
            <div className={styles.deleteAccountInfo}>
              <div className={styles.titleRow}>
                <h3 id="danger-zone-title" className={styles.deleteTitle}>
                  Supprimer mon compte
                </h3>
                <InfoIcon
                  tooltip="La suppression de votre compte entraînera la suppression définitive de : vos lieux, vos événements, vos partenariats, vos avis et commentaires et votre profil utilisateur. Cette action est irréversible et ne peut pas être annulée."
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
              ariaLabel="Supprimer définitivement mon compte et toutes mes données"
            >
              {isLoading ? "Suppression..." : "Supprimer"}
            </Button>
          </article>
        </section>
      </section>
    </div>
  );
};

export default AccountSettingsContainer;
