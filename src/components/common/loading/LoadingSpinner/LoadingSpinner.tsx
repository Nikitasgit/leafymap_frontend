import React from "react";
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
      aria-label="Chargement en cours"
      role="status"
    />
  );
};

export default LoadingSpinner;

