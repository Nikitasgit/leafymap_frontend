"use client";

import { Menu, X } from "lucide-react";
import styles from "./NavbarMobileMenuButton.module.scss";

interface NavbarMobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function NavbarMobileMenuButton({
  isOpen,
  onToggle,
}: NavbarMobileMenuButtonProps) {
  return (
    <button
      className={styles.button}
      onClick={onToggle}
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
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
