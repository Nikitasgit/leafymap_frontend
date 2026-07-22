"use client";

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import Skeleton from "@mui/material/Skeleton";
import Button from "@/shared/ui/buttons/button";
import styles from "./BaseModal.module.scss";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  titleIcon?: React.ReactNode;
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
  withLoadingState?: boolean;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  titleIcon,
  children,
  primaryButtonLabel,
  secondaryButtonLabel,
  onPrimaryAction,
  onSecondaryAction,
  isPrimaryDisabled = false,
  isSubmitLoading = false,
  primaryButtonType = "submit",
  isContentLoading = false,
  withFooter = true,
  withLoadingState = true,
}) => {
  const { t } = useTranslation("common");
  const resolvedSecondaryButtonLabel =
    secondaryButtonLabel ?? t("actions.cancel");
  const [showContent, setShowContent] = React.useState(false);
  const scrollYRef = React.useRef(0);
  const CONTENT_DELAY_MS = 100;

  const showSkeleton = withLoadingState && !showContent;

  useEffect(() => {
    if (!isOpen) return;

    scrollYRef.current = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (withLoadingState && !isContentLoading) {
      timer = setTimeout(() => setShowContent(true), CONTENT_DELAY_MS);
    }

    return () => {
      const savedScrollY = scrollYRef.current;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, savedScrollY);
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, isContentLoading, withLoadingState]);

  if (!isOpen && showContent) {
    setShowContent(false);
  }

  if (isOpen && !withLoadingState && !showContent) {
    setShowContent(true);
  }

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

  if (!isOpen) return null;

  const modalBody = (
    <>
      <div className={styles.modalContentBody}>
        {showSkeleton ? (
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
              {resolvedSecondaryButtonLabel}
            </Button>
            <Button
              type={primaryButtonType}
              variant="primary"
              disabled={isPrimaryDisabled || isSubmitLoading}
              onClick={
                primaryButtonType === "button" ? handlePrimaryClick : undefined
              }
            >
              {isSubmitLoading ? t("baseModal.loading") : primaryButtonLabel}
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
          {showSkeleton ? (
            <Skeleton
              variant="rounded"
              height={28}
              sx={{ flex: 1, maxWidth: "60%" }}
            />
          ) : (
            <div className={styles.titleRow}>
              {titleIcon && (
                <span className={styles.titleIcon}>{titleIcon}</span>
              )}
              <h2 className={styles.title}>{title}</h2>
            </div>
          )}{" "}
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label={t("baseModal.closeAriaLabel")}
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
