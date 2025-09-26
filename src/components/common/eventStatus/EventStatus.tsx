import React from "react";
import { useTranslation } from "next-i18next";
import styles from "./EventStatus.module.scss";

interface EventStatusProps {
  status:
    | "upcoming"
    | "ongoing"
    | "completed"
    | "unvalid"
    | "pending"
    | "accepted"
    | "refused";
  className?: string;
}

const EventStatus: React.FC<EventStatusProps> = ({
  status,
  className = "",
}) => {
  const { t } = useTranslation("common");
  const statusText = t(`eventStatus.${status}`);

  return (
    <span className={`${styles.eventStatus} ${styles[status]} ${className}`}>
      <p className={styles.statusText}>{statusText}</p>
    </span>
  );
};

export default EventStatus;
