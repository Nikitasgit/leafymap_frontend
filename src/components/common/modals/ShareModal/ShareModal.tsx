"use client";

import React from "react";
import { Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("common");
  const { showSuccess } = useToast();

  const whatsAppShareUrl =
    url &&
    `https://wa.me/?text=${encodeURIComponent((text || title) + " " + url)}`;

  const handleCopyLink = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      showSuccess(t("shareModal.linkCopied"));
    } catch {
      showSuccess(t("shareModal.copyFailed"));
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
      title={t("shareModal.title")}
      titleIcon={<Share2 size={22} />}
      primaryButtonLabel={t("shareModal.copyLink")}
      secondaryButtonLabel={t("actions.close")}
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
            aria-label={t("shareModal.shareUrlAriaLabel")}
          />
        </div>

        {whatsAppShareUrl && (
          <a
            href={whatsAppShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappButton}
            aria-label={t("shareModal.whatsappAriaLabel")}
          >
            <WhatsAppIcon size={20} />
            <span>{t("shareModal.whatsappButton")}</span>
          </a>
        )}
      </div>
    </BaseModal>
  );
};

export default ShareModal;
