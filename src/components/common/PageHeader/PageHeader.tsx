import React from "react";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/common/buttons/button/Button";
import Text from "@/components/common/typography/Text";
import styles from "./PageHeader.module.scss";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  backButtonLabel?: string;
  rightComponent?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackClick,
  backButtonLabel = "Retour",
  rightComponent,
  className,
}) => {
  return (
    <div className={`${styles.header} ${className || ""}`}>
      <div className={styles.titleSection}>
        <div className={styles.titleRow}>
          {showBackButton && (
            <Button
              variant="simple"
              onClick={onBackClick}
              className={styles.backButton}
              aria-label={backButtonLabel}
            >
              <ArrowLeft size={20} />
            </Button>
          )}
          <Text as="h1" className={styles.title}>
            {title}
          </Text>
        </div>
        {subtitle && (
          <Text as="p" className={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </div>
      {rightComponent && (
        <div className={styles.rightComponent}>{rightComponent}</div>
      )}
    </div>
  );
};

export default PageHeader;
