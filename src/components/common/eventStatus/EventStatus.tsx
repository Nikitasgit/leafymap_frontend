import React from "react";
import Text from "@/components/common/typography/Text";
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
      <Text as="p" className={styles.statusText}>
        {statusText}
      </Text>
    </span>
  );
};

export default EventStatus;
