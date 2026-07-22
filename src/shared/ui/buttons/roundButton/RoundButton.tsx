"use client";

import React from "react";
import styles from "./RoundButton.module.scss";

export interface RoundButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  ariaLabel?: string;
  type?: "button" | "submit";
}

const RoundButton: React.FC<RoundButtonProps> = ({
  icon,
  label,
  onClick,
  variant = "secondary",
  disabled = false,
  ariaLabel,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      className={`${styles.roundButton} ${styles[variant]}`}
    >
      <span className={styles.iconWrapper}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </button>
  );
};

export default RoundButton;
