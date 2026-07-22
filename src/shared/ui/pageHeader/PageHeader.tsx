import React from "react";
import styles from "./PageHeader.module.scss";
import BackButton from "../buttons/backButton";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  path?: string;
  className?: string;
  }

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
    path,
  className,
}) => {
  return (
    <header className={`${styles.header} ${className || ""}`}>
      <div className={styles.titleSection}>
        <div className={styles.titleRow}>
          {showBackButton && <BackButton path={path} />}
          <h1 className={styles.title}>
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className={styles.subtitle}>
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
