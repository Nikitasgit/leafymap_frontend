"use client";

import React from "react";
import { Share2 } from "lucide-react";
import BaseModal from "@/components/common/modals/BaseModal";
import { WhatsAppIcon } from "@/assets/svg";
import { useToast } from "@/hooks/useToast";
import styles from "./ShareModal.module.scss";

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  text?: string;
  url: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  text,
  url,
}) => {
  const { showSuccess } = useToast();

  const whatsAppShareUrl =
    url &&
    `https://wa.me/?text=${encodeURIComponent((text || title) + " " + url)}`;

  const handleCopyLink = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      showSuccess("Lien copié dans le presse-papiers");
    } catch {
      showSuccess("Impossible de copier le lien");
    }
  };

  const handlePrimaryAction = (e: React.FormEvent) => {
    e.preventDefault();
    handleCopyLink();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Partager"
      titleIcon={<Share2 size={22} />}
      primaryButtonLabel="Copier le lien"
      secondaryButtonLabel="Fermer"
      onPrimaryAction={handlePrimaryAction}
      onSecondaryAction={onClose}
      primaryButtonType="button"
      withFooter={true}
      withLoadingState={false}
    >
      <div className={styles.body}>
        {text && <p className={styles.subtitle}>{text}</p>}

        <div className={styles.urlRow}>
          <input
            type="text"
            readOnly
            value={url}
            className={styles.urlInput}
            aria-label="Lien à partager"
          />
        </div>

        {whatsAppShareUrl && (
          <a
            href={whatsAppShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappButton}
            aria-label="Partager sur WhatsApp"
          >
            <WhatsAppIcon size={20} />
            <span>Partager sur WhatsApp</span>
          </a>
        )}
      </div>
    </BaseModal>
  );
};

export default ShareModal;
