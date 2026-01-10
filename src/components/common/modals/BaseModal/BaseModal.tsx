import React, { useEffect } from "react";
import { X } from "lucide-react";
import Button from "@/components/common/buttons/Button/Button";
import styles from "./BaseModal.module.scss";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  primaryButtonLabel: string;
  secondaryButtonLabel?: string;
  onPrimaryAction: (e: React.FormEvent) => void | Promise<void>;
  onSecondaryAction?: () => void;
  isPrimaryDisabled?: boolean;
  isLoading?: boolean;
  primaryButtonType?: "button" | "submit";
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  primaryButtonLabel,
  secondaryButtonLabel = "Annuler",
  onPrimaryAction,
  onSecondaryAction,
  isPrimaryDisabled = false,
  isLoading = false,
  primaryButtonType = "submit",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else {
      onClose();
    }
  };

  const handlePrimaryClick = () => {
    if (primaryButtonType === "button") {
      const syntheticEvent = {
        preventDefault: () => {},
      } as React.FormEvent;
      onPrimaryAction(syntheticEvent);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fermer la modale"
        >
          <X size={24} />
        </button>
        <form onSubmit={onPrimaryAction} className={styles.form}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.content}>{children}</div>
          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSecondaryClick}
              disabled={isLoading}
            >
              {secondaryButtonLabel}
            </Button>
            <Button
              type={primaryButtonType}
              variant="primary"
              disabled={isPrimaryDisabled || isLoading}
              onClick={
                primaryButtonType === "button" ? handlePrimaryClick : undefined
              }
            >
              {isLoading ? "Chargement..." : primaryButtonLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BaseModal;
