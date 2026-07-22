"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./LoadingSpinner.module.scss";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 20,
  color,
  className = "",
}) => {
  const { t } = useTranslation("common");
  const spinnerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    ...(color && {
      borderTopColor: color,
    }),
  };

  return (
    <div
      className={`${styles.loadingSpinner} ${className}`}
      style={spinnerStyle}
      aria-label={t("loadingSpinner.ariaLabel")}
      role="status"
    />
  );
};

export default LoadingSpinner;

