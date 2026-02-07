import React, { useEffect } from "react";
import { X } from "lucide-react";
import Skeleton from "@mui/material/Skeleton";
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
  const [showContent, setShowContent] = React.useState(false);
  const CONTENT_DELAY_MS = 100;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setShowContent(false);
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (primaryButtonType === "submit") {
      onPrimaryAction(e);
    }
  };

  useEffect(() => {
    if (isContentLoading) {
      setShowContent(false);
    } else {
      const t = setTimeout(() => setShowContent(true), CONTENT_DELAY_MS);
      return () => clearTimeout(t);
    }
  }, [isContentLoading]);
  if (!isOpen) return null;

  const modalBody = (
    <>
      <div className={styles.modalContentBody}>
        {!showContent ? (
          <div className={styles.skeletonContent}>
            <Skeleton variant="rounded" height={120} sx={{ width: "100%" }} />
            <Skeleton variant="rounded" height={14} sx={{ width: "100%" }} />
            <Skeleton variant="rounded" height={14} sx={{ width: "70%" }} />
            <Skeleton variant="rounded" height={14} sx={{ width: "40%" }} />
          </div>
        ) : (
          children
        )}
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
                primaryButtonType === "button" ? handlePrimaryClick : undefined
              }
            >
              {isSubmitLoading ? "Chargement..." : primaryButtonLabel}
            </Button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className={styles.modal} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalContentHeader}>
          {!showContent ? (
            <Skeleton
              variant="rounded"
              height={28}
              sx={{ flex: 1, maxWidth: "60%" }}
            />
          ) : (
            <h2 className={styles.title}>{title}</h2>
          )}{" "}
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fermer la modale"
          >
            <X size={24} />
          </button>
        </div>
        {primaryButtonType === "submit" && withFooter ? (
          <form onSubmit={handleFormSubmit}>{modalBody}</form>
        ) : (
          modalBody
        )}
      </div>
    </div>
  );
};

export default BaseModal;
