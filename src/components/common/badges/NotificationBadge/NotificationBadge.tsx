import React from "react";
import styles from "./NotificationBadge.module.scss";

interface NotificationBadgeProps {
  count: number;
  className?: string;
  absolutePosition?: boolean;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  className,
  absolutePosition = false,
}) => {
  if (count <= 0) return null;

  const displayText = count > 99 ? "99+" : count.toString();
  const digitCount = displayText.length;

  return (
    <span
      className={`${styles.badge} ${className || ""} ${absolutePosition ? styles.absolutePosition : ""}`}
      data-count={digitCount}
    >
      {displayText}
    </span>
  );
};

export default NotificationBadge;
