"use client";

import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./NavbarMobileMenuButton.module.scss";

interface NavbarMobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function NavbarMobileMenuButton({
  isOpen,
  onToggle,
}: NavbarMobileMenuButtonProps) {
  const { t } = useTranslation("common");

  return (
    <button
      className={styles.button}
      onClick={onToggle}
      aria-label={
        isOpen ? t("navbar.closeMenuAriaLabel") : t("navbar.openMenuAriaLabel")
      }
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      {isOpen ? (
        <X size={20} aria-hidden="true" />
      ) : (
        <Menu size={20} aria-hidden="true" />
      )}
    </button>
  );
}
