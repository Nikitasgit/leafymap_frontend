import React, { useEffect } from "react";
import { X } from "lucide-react";
import Button from "@/components/common/buttons/Button/Button";
import styles from "./BaseModal.module.scss";
import LoadingSpinner from "../../loading/LoadingSpinner";

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
  isSubmitLoading?: boolean;
  isContentLoading?: boolean;
  primaryButtonType?: "button" | "submit";
  withFooter?: boolean;
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
  isSubmitLoading = false,
  primaryButtonType = "submit",
  isContentLoading = false,
  withFooter = true,
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
        <div className={styles.modalContentHeader}>
          <h2 className={styles.title}>{title}</h2>{" "}
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fermer la modale"
          >
            <X size={24} />
          </button>
        </div>
        <div className={styles.modalContentBody}>
          {isContentLoading ? <LoadingSpinner /> : children}
        </div>
        {withFooter && (
          <div className={styles.modalFooter}>
            <div className={styles.modalFooterButtons}>
              <Button
                type="button"
                variant="secondary"
                onClick={handleSecondaryClick}
                disabled={isSubmitLoading}
              >
                {secondaryButtonLabel}
              </Button>
              <Button
                type={primaryButtonType}
                variant="primary"
                disabled={isPrimaryDisabled || isSubmitLoading}
                onClick={
                  primaryButtonType === "button"
                    ? handlePrimaryClick
                    : undefined
                }
              >
                {isSubmitLoading ? "Chargement..." : primaryButtonLabel}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseModal;
