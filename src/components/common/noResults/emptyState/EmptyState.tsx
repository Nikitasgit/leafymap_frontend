import React from "react";
import styles from "./EmptyState.module.scss";

const EmptyState = ({
  title,
  icon,
  description,
  button,
  isError = false,
}: {
  title: string;
  icon?: React.ReactNode;
  description?: string;
  button?: React.ReactNode;
  isError?: boolean;
}) => {
  return (
    <div className={`${styles.emptyState} ${isError ? styles.error : ""}`}>
      {icon && icon}
      <p className={styles.title}>
        {title}
      </p>
      {description && (
        <p className={styles.description}>
          {description}
        </p>
      )}
      {button && button}
    </div>
  );
};

export default EmptyState;
