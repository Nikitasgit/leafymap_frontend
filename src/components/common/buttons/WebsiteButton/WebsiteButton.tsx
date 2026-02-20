import { useState } from "react";
import Button from "@/components/common/buttons/Button";
import BaseModal from "@/components/common/modals/BaseModal/BaseModal";
import { APP_NAME } from "@/utils/constants";
import styles from "./WebsiteButton.module.scss";

export interface WebsiteButtonProps {
  website: string;
  variant?: "primary" | "secondary";
  ariaLabel?: string;
  className?: string;
}

const WebsiteButton = ({
  website,
  variant = "secondary",
  ariaLabel = "Site web",
  className,
}: WebsiteButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(website, "_blank");
    setIsModalOpen(false);
  };

  // Extraire le domaine de l'URL pour l'affichage
  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      return urlObj.hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const displayUrl = getDomain(website);

  return (
    <>
      <Button
        onClick={handleOpenModal}
        ariaLabel={ariaLabel}
        variant={variant}
        type="button"
        className={className}
      >
        Site web
      </Button>
      <BaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`Quitter ${APP_NAME}`}
        primaryButtonLabel="Continuer"
        secondaryButtonLabel="Annuler"
        onPrimaryAction={handleConfirm}
        primaryButtonType="button"
      >
        <p className={styles.modalMessage}>
          Vous quittez {APP_NAME}, vous allez être redirigé vers ce site :{" "}
          <strong>{displayUrl}</strong>, souhaitez-vous continuer ?
        </p>
      </BaseModal>
    </>
  );
};

export default WebsiteButton;
